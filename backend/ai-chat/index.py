import json
import os
from typing import Dict, Any, List, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat endpoint with fallback between Gemini, Llama, GigaChat
    Args: event with httpMethod, body (message, models config)
          context with request_id
    Returns: AI response or error with fallback info
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
                    response = call_gemini(message, api_key)
                elif model_name == 'llama':
                    response = call_llama(message, api_key)
                elif model_name == 'gigachat':
                    response = call_gigachat(message, api_key)
                else:
                    continue
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'response': response,
                        'model': model_name,
                        'fallback_used': len(errors) > 0
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


def call_gemini(message: str, api_key: str) -> str:
    '''Call Google Gemini API'''
    import requests
    
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}'
    
    payload = {
        'contents': [{
            'parts': [{
                'text': message
            }]
        }]
    }
    
    response = requests.post(url, json=payload, timeout=30)
    response.raise_for_status()
    
    data = response.json()
    
    if 'candidates' in data and len(data['candidates']) > 0:
        return data['candidates'][0]['content']['parts'][0]['text']
    
    raise Exception('Invalid Gemini response format')


def call_llama(message: str, api_key: str) -> str:
    '''Call Meta Llama via Replicate API'''
    import requests
    
    headers = {
        'Authorization': f'Token {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'version': 'meta/llama-2-70b-chat',
        'input': {
            'prompt': message,
            'max_length': 500
        }
    }
    
    response = requests.post(
        'https://api.replicate.com/v1/predictions',
        headers=headers,
        json=payload,
        timeout=30
    )
    response.raise_for_status()
    
    data = response.json()
    
    if 'output' in data:
        return ''.join(data['output']) if isinstance(data['output'], list) else str(data['output'])
    
    if 'urls' in data and 'get' in data['urls']:
        import time
        get_url = data['urls']['get']
        
        for _ in range(30):
            time.sleep(1)
            status_response = requests.get(get_url, headers=headers, timeout=10)
            status_response.raise_for_status()
            status_data = status_response.json()
            
            if status_data.get('status') == 'succeeded':
                output = status_data.get('output', [])
                return ''.join(output) if isinstance(output, list) else str(output)
            elif status_data.get('status') == 'failed':
                raise Exception('Llama prediction failed')
        
        raise Exception('Llama timeout')
    
    raise Exception('Invalid Llama response format')


def call_gigachat(message: str, api_key: str) -> str:
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
    
    chat_payload = {
        'model': 'GigaChat',
        'messages': [{
            'role': 'user',
            'content': message
        }],
        'temperature': 0.7
    }
    
    chat_response = requests.post(chat_url, headers=chat_headers, json=chat_payload, timeout=30, verify=False)
    chat_response.raise_for_status()
    
    data = chat_response.json()
    
    if 'choices' in data and len(data['choices']) > 0:
        return data['choices'][0]['message']['content']
    
    raise Exception('Invalid GigaChat response format')
