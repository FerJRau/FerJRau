import json

with open('current_workflow_structure.json', 'r') as f:
    workflow = json.load(f)

print("Checking all nodes for webhook format assumptions...")

for node in workflow['nodes']:
    if node['id'] == 'input-validator':
        old_condition = node['parameters']['conditions']['conditions'][0]['leftValue']
        node['parameters']['conditions']['conditions'][0]['leftValue'] = "={{ $json.messages?.length > 0 }}"
        print(f"✅ Updated Input Validator condition:")
        print(f"   Old: {old_condition}")
        print(f"   New: {node['parameters']['conditions']['conditions'][0]['leftValue']}")
    
    elif node['id'] == 'data-processor':
        js_code = node['parameters']['jsCode']
        if 'entry && $json.entry[0]?.changes?.[0]?.value?.messages' in js_code:
            new_js_code = js_code.replace(
                'if ($json.entry && $json.entry[0]?.changes?.[0]?.value?.messages) {\n  // Webhook mode - real WhatsApp message\n  const whatsappData = $json.entry[0].changes[0].value;\n  phoneNumber = whatsappData.messages[0].from;\n  messageText = whatsappData.messages[0].text.body;\n} else {',
                'if ($json.messages && $json.messages.length > 0) {\n  // Webhook mode - real WhatsApp message\n  phoneNumber = $json.messages[0].from;\n  messageText = $json.messages[0].text.body;\n} else {'
            ).replace(
                'execution_mode: $json.entry ? "webhook" : "manual",',
                'execution_mode: $json.messages ? "webhook" : "manual",'
            )
            node['parameters']['jsCode'] = new_js_code
            print(f"✅ Updated Data Processor webhook format handling")
        else:
            print(f"⚠️  Data Processor already has correct format or needs manual review")
    
    elif node['type'] == 'n8n-nodes-base.whatsApp' and 'recipientPhoneNumber' in str(node.get('parameters', {})):
        recipient_param = node['parameters'].get('recipientPhoneNumber', '')
        if 'WhatsApp Trigger' in recipient_param:
            print(f"✅ WhatsApp Send message node references correct trigger data")
        else:
            print(f"⚠️  WhatsApp Send message node may need phone number reference update")

workflow_update = {
    "name": workflow["name"],
    "nodes": workflow["nodes"], 
    "connections": workflow["connections"],
    "settings": workflow["settings"],
    "staticData": workflow.get("staticData")
}

with open('input_validator_and_data_processor_fix.json', 'w') as f:
    json.dump(workflow_update, f, indent=2)

print('\n✅ All webhook format fixes created successfully')
