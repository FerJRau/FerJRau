import json

with open('fresh_workflow.json', 'r') as f:
    workflow = json.load(f)

proper_workflow_update = {
    "name": workflow["name"],
    "nodes": workflow["nodes"],
    "connections": workflow["connections"],
    "settings": workflow["settings"],
    "staticData": workflow.get("staticData")
}

for node in proper_workflow_update['nodes']:
    if node['id'] == 'supabase-logger':
        node['parameters'] = {
            'operation': 'create',
            'tableId': 'conversation_logs',
            'columns': {
                'session_id': "={{ $('Response Logger').item.json.log_data.session_id }}",
                'client_phone': "={{ $('Response Logger').item.json.log_data.client_phone }}",
                'client_name': "={{ $('Response Logger').item.json.log_data.client_name }}",
                'user_messages': "={{ JSON.stringify($('Response Logger').item.json.log_data.user_messages) }}",
                'ai_responses': "={{ JSON.stringify($('Response Logger').item.json.log_data.ai_responses) }}",
                'processing_time_ms': "={{ $('Response Logger').item.json.log_data.processing_time_ms }}",
                'client_rfc': "={{ $('Response Logger').item.json.log_data.client_rfc }}",
                'detected_service_name': "={{ $('Response Logger').item.json.log_data.detected_service_name }}",
                'escalated': "={{ $('Response Logger').item.json.log_data.escalated }}",
                'last_interaction_at': "={{ $('Response Logger').item.json.log_data.last_interaction_at }}"
            }
        }
        print(f"Updated Supabase Logger node: {node['id']}")
        break

with open('proper_workflow_update.json', 'w') as f:
    json.dump(proper_workflow_update, f, indent=2)

print('Properly structured workflow update created successfully')
