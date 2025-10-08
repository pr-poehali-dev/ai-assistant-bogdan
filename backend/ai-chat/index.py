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
    '''Call Google Gemini 2.0 Flash via OpenRouter with timeout protection'''
    import requests
    
    url = 'https://openrouter.ai/api/v1/chat/completions'
    
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
        'model': 'google/gemini-2.0-flash-exp:free',
        'messages': messages,
        'temperature': settings.get('temperature', 0.7),
        'max_tokens': settings.get('max_tokens', 2048),
        'top_p': settings.get('top_p', 0.9),
        'top_k': settings.get('top_k', 40),
        'frequency_penalty': settings.get('frequency_penalty', 0.0),
        'presence_penalty': settings.get('presence_penalty', 0.0),
        'repetition_penalty': settings.get('repetition_penalty', 1.0),
        'stream': False
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=25)
        response.raise_for_status()
    except requests.exceptions.Timeout:
        raise Exception('Gemini timeout - try again')
    except requests.exceptions.RequestException as e:
        raise Exception(f'Gemini API error: {str(e)}')
    
    data = response.json()
    
    if 'choices' in data and len(data['choices']) > 0:
        return data['choices'][0]['message']['content']
    
    raise Exception('Invalid Gemini response format')


def call_llama_33_70b(message: str, api_key: str, history: List[Dict[str, str]], settings: Dict[str, Any]) -> str:
    '''Call Meta Llama 3.3 70B Instruct via OpenRouter with timeout protection'''
    import requests
    
    url = 'https://openrouter.ai/api/v1/chat/completions'
    
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
        'model': 'meta-llama/llama-3.3-70b-instruct',
        'messages': messages,
        'temperature': settings.get('temperature', 0.7),
        'max_tokens': settings.get('max_tokens', 2048),
        'top_p': settings.get('top_p', 0.9),
        'top_k': settings.get('top_k', 40),
        'frequency_penalty': settings.get('frequency_penalty', 0.0),
        'presence_penalty': settings.get('presence_penalty', 0.0),
        'repetition_penalty': settings.get('repetition_penalty', 1.0),
        'stream': False
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=25)
        response.raise_for_status()
    except requests.exceptions.Timeout:
        raise Exception('Llama timeout - try again')
    except requests.exceptions.RequestException as e:
        raise Exception(f'Llama API error: {str(e)}')
    
    data = response.json()
    
    if 'choices' in data and len(data['choices']) > 0:
        return data['choices'][0]['message']['content']
    
    raise Exception('Invalid Llama response format')


def call_gigachat(message: str, api_key: str, history: List[Dict[str, str]], settings: Dict[str, Any]) -> str:
    '''Call GigaChat API (Sber) with timeout protection'''
    import requests
    import uuid
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    auth_url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
    auth_headers = {
        'Authorization': f'Basic {api_key}',
        'RqUID': str(uuid.uuid4()),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    auth_data = {'scope': 'GIGACHAT_API_PERS'}
    
    try:
        auth_response = requests.post(auth_url, headers=auth_headers, data=auth_data, timeout=8, verify=False)
        auth_response.raise_for_status()
    except requests.exceptions.Timeout:
        raise Exception('GigaChat auth timeout (8s) - service unavailable')
    except requests.exceptions.RequestException as e:
        raise Exception(f'GigaChat auth failed: {str(e)}')
    
    access_token = auth_response.json().get('access_token')
    if not access_token:
        raise Exception('No access token in GigaChat response')
    
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
        'max_tokens': min(settings.get('max_tokens', 2048), 1024)
    }
    
    try:
        chat_response = requests.post(chat_url, headers=chat_headers, json=chat_payload, timeout=15, verify=False)
        chat_response.raise_for_status()
    except requests.exceptions.Timeout:
        raise Exception('GigaChat response timeout (15s) - try again later')
    except requests.exceptions.RequestException as e:
        raise Exception(f'GigaChat API error: {str(e)}')
    
    data = chat_response.json()
    
    if 'choices' in data and len(data['choices']) > 0:
        return data['choices'][0]['message']['content']
    
    raise Exception('Invalid GigaChat response format')