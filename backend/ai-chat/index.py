import json
import os
from typing import Dict, Any, List, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat with Gemini 2.0 Flash, Llama 3.3 70B, GigaChat - stream, history, settings
    Args: event with httpMethod, body (message, models, history, settings)
          context with request_id
    Returns: AI response with model info and fallback
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        message: str = body_data.get('message', '')
        models_config: Dict[str, Dict[str, Any]] = body_data.get('models', {})
        history: List[Dict[str, str]] = body_data.get('history', [])
        settings: Dict[str, Any] = body_data.get('settings', {
            'temperature': 0.7,
            'max_tokens': 2048,
            'system_prompt': ''
        })
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message is required'})
            }
        
        enabled_models = [
            (name, config) for name, config in models_config.items()
            if config.get('enabled') and config.get('key')
        ]
        
        if not enabled_models:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No AI models configured'})
            }
        
        errors = []
        
        for model_name, config in enabled_models:
            try:
                api_key = config.get('key', '')
                
                if model_name == 'gemini':
                    response = call_gemini_2_flash(message, api_key, history, settings)
                elif model_name == 'llama':
                    response = call_llama_33_70b(message, api_key, history, settings)
                elif model_name == 'gigachat':
                    response = call_gigachat(message, api_key, history, settings)
                else:
                    continue
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'response': response,
                        'model': model_name,
                        'fallback_used': len(errors) > 0,
                        'errors': errors if errors else None
                    })
                }
                
            except Exception as e:
                errors.append({'model': model_name, 'error': str(e)})
                continue
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'All AI models failed',
                'details': errors
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def call_gemini_2_flash(message: str, api_key: str, history: List[Dict[str, str]], settings: Dict[str, Any]) -> str:
    '''Call Google Gemini 2.0 Flash Experimental (free)'''
    import requests
    
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}'
    
    contents = []
    
    for msg in history[-10:]:
        role = 'user' if msg['role'] == 'user' else 'model'
        contents.append({
            'role': role,
            'parts': [{'text': msg['content']}]
        })
    
    contents.append({
        'role': 'user',
        'parts': [{'text': message}]
    })
    
    payload = {
        'contents': contents,
        'generationConfig': {
            'temperature': settings.get('temperature', 0.7),
            'maxOutputTokens': settings.get('max_tokens', 2048),
        }
    }
    
    if settings.get('system_prompt'):
        payload['systemInstruction'] = {
            'parts': [{'text': settings['system_prompt']}]
        }
    
    response = requests.post(url, json=payload, timeout=30)
    response.raise_for_status()
    
    data = response.json()
    
    if 'candidates' in data and len(data['candidates']) > 0:
        return data['candidates'][0]['content']['parts'][0]['text']
    
    raise Exception('Invalid Gemini response format')


def call_llama_33_70b(message: str, api_key: str, history: List[Dict[str, str]], settings: Dict[str, Any]) -> str:
    '''Call Meta Llama 3.3 70B Instruct (free via Together AI)'''
    import requests
    
    url = 'https://api.together.xyz/v1/chat/completions'
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    messages = []
    
    if settings.get('system_prompt'):
        messages.append({
            'role': 'system',
            'content': settings['system_prompt']
        })
    
    for msg in history[-10:]:
        messages.append({
            'role': msg['role'],
            'content': msg['content']
        })
    
    messages.append({
        'role': 'user',
        'content': message
    })
    
    payload = {
        'model': 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        'messages': messages,
        'temperature': settings.get('temperature', 0.7),
        'max_tokens': settings.get('max_tokens', 2048),
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    
    data = response.json()
    
    if 'choices' in data and len(data['choices']) > 0:
        return data['choices'][0]['message']['content']
    
    raise Exception('Invalid Llama response format')


def call_gigachat(message: str, api_key: str, history: List[Dict[str, str]], settings: Dict[str, Any]) -> str:
    '''Call GigaChat API (Sber)'''
    import requests
    import uuid
    
    auth_url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
    auth_headers = {
        'Authorization': f'Basic {api_key}',
        'RqUID': str(uuid.uuid4()),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    auth_data = {'scope': 'GIGACHAT_API_PERS'}
    
    auth_response = requests.post(auth_url, headers=auth_headers, data=auth_data, timeout=10, verify=False)
    auth_response.raise_for_status()
    
    access_token = auth_response.json()['access_token']
    
    chat_url = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions'
    chat_headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    messages = []
    
    if settings.get('system_prompt'):
        messages.append({
            'role': 'system',
            'content': settings['system_prompt']
        })
    
    for msg in history[-10:]:
        messages.append({
            'role': msg['role'],
            'content': msg['content']
        })
    
    messages.append({
        'role': 'user',
        'content': message
    })
    
    chat_payload = {
        'model': 'GigaChat',
        'messages': messages,
        'temperature': settings.get('temperature', 0.7),
        'max_tokens': settings.get('max_tokens', 2048)
    }
    
    chat_response = requests.post(chat_url, headers=chat_headers, json=chat_payload, timeout=30, verify=False)
    chat_response.raise_for_status()
    
    data = chat_response.json()
    
    if 'choices' in data and len(data['choices']) > 0:
        return data['choices'][0]['message']['content']
    
    raise Exception('Invalid GigaChat response format')
