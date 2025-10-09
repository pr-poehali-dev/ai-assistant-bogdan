import json
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat using OpenRouter auto model selection
    Args: event with httpMethod, body (message, apiKey, history, settings)
          context with request_id
    Returns: AI response from best available free model
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        message: str = body_data.get('message', '')
        api_key: str = body_data.get('apiKey', '')
        user_id: str = body_data.get('userId', 'default')
        selected_model: str = body_data.get('selectedModel', '')
        history: List[Dict[str, str]] = body_data.get('history', [])
        settings: Dict[str, Any] = body_data.get('settings', {
            'temperature': 0.7,
            'max_tokens': 2048,
            'system_prompt': ''
        })
        knowledge_context: str = body_data.get('knowledgeContext', '')
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Сообщение обязательно'}),
                'isBase64Encoded': False
            }
        
        if not api_key:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'API ключ OpenRouter обязателен. Получите бесплатный ключ на openrouter.ai'}),
                'isBase64Encoded': False
            }
        
        response_text = call_openrouter_auto(message, api_key, history, settings, knowledge_context, selected_model)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'response': response_text,
                'model': 'auto'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }


def call_openrouter_auto(message: str, api_key: str, history: List[Dict[str, str]], settings: Dict[str, Any], knowledge_context: str = '', selected_model: str = '') -> str:
    '''Call OpenRouter with auto model selection - picks best free model automatically'''
    import requests
    
    url = 'https://openrouter.ai/api/v1/chat/completions'
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://poehali.dev',
        'X-Title': 'AI Chat Assistant'
    }
    
    messages = []
    
    system_content = settings.get('system_prompt', '')
    
    if knowledge_context:
        kb_prompt = f"\n\nБаза знаний (используй эту информацию для ответов):\n{knowledge_context}"
        system_content = system_content + kb_prompt if system_content else kb_prompt.strip()
    
    if system_content:
        messages.append({
            'role': 'system',
            'content': system_content
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
    
    free_models = [
        'meta-llama/llama-3.2-3b-instruct:free',
        'google/gemma-2-9b-it:free',
        'microsoft/phi-3-mini-128k-instruct:free',
        'qwen/qwen-2-7b-instruct:free',
    ]
    
    if selected_model and selected_model in free_models:
        models_to_try = [selected_model]
    else:
        models_to_try = free_models
    
    last_error = None
    
    for model in models_to_try:
        payload = {
            'model': model,
            'messages': messages,
            'temperature': settings.get('temperature', 0.7),
            'max_tokens': settings.get('max_tokens', 2048)
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'choices' in data and len(data['choices']) > 0:
                return data['choices'][0]['message']['content']
                
        except requests.exceptions.Timeout:
            last_error = 'Превышено время ожидания'
            continue
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                raise Exception('Неверный API ключ OpenRouter. Получите бесплатный ключ на openrouter.ai/keys')
            elif e.response.status_code == 429:
                last_error = 'Превышен лимит запросов'
                continue
            elif e.response.status_code == 402:
                last_error = 'Модель требует оплаты'
                continue
            else:
                last_error = str(e)
                continue
        except requests.exceptions.RequestException as e:
            last_error = str(e)
            continue
    
    raise Exception(f'Все бесплатные модели недоступны. Последняя ошибка: {last_error}. Попробуйте позже или проверьте баланс на openrouter.ai')