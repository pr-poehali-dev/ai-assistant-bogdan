import json
import os
from typing import Dict, Any, List
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage knowledge base - upload, list, delete files for AI context
    Args: event with httpMethod, body (action, userId, filename, content)
          context with request_id
    Returns: Success/error response with knowledge base data
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            raise Exception('DATABASE_URL not configured')
        
        conn = psycopg2.connect(dsn)
        conn.set_session(autocommit=True)
        cursor = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            user_id = params.get('userId', 'default')
            
            cursor.execute(
                "SELECT id, filename, file_type, file_size, created_at FROM knowledge_base WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,)
            )
            
            rows = cursor.fetchall()
            files = []
            for row in rows:
                files.append({
                    'id': row[0],
                    'filename': row[1],
                    'fileType': row[2],
                    'fileSize': row[3],
                    'createdAt': row[4].isoformat() if row[4] else None
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'files': files})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'upload')
            
            if action == 'upload':
                user_id = body_data.get('userId', 'default')
                filename = body_data.get('filename', '')
                content = body_data.get('content', '')
                file_type = body_data.get('fileType', 'text')
                file_size = body_data.get('fileSize', len(content))
                
                if not filename or not content:
                    cursor.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Filename and content required'})
                    }
                
                cursor.execute(
                    "INSERT INTO knowledge_base (user_id, filename, content, file_type, file_size) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (user_id, filename, content, file_type, file_size)
                )
                
                file_id = cursor.fetchone()[0]
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'fileId': file_id})
                }
            
            elif action == 'getContext':
                user_id = body_data.get('userId', 'default')
                
                cursor.execute(
                    "SELECT filename, content FROM knowledge_base WHERE user_id = %s ORDER BY created_at DESC LIMIT 10",
                    (user_id,)
                )
                
                rows = cursor.fetchall()
                context = ""
                
                for row in rows:
                    context += f"\n\n--- Файл: {row[0]} ---\n{row[1]}\n"
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'context': context.strip()})
                }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            file_id = body_data.get('fileId')
            user_id = body_data.get('userId', 'default')
            
            if not file_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'File ID required'})
                }
            
            cursor.execute(
                "DELETE FROM knowledge_base WHERE id = %s AND user_id = %s",
                (file_id, user_id)
            )
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
