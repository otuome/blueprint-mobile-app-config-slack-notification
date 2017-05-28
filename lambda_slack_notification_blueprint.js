var https = require('https');
var util = require('util');

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, 2));
    console.log('From SNS: ', event.Records[0].Sns.Message);
    console.log('Event Trigger: ', event.Records[0].Sns.Message.eventTriggerName);

    var postData = {
        "channel": "foobar-cfg",
        "username": "AWS SNS via Lambda", 
        "text": "*" + event.Records[0].Sns.Subject + "*", 
        "icon_emoji": ":aws:"
    };

    var trigger = event.Records[0].Sns.Message.eventTriggerName;

    var msg, message, severity, group, instanceId, errorInfo, status;

    switch (trigger) {
        case "Sample_Mobile_Config_Deployment_Status_Trigger":
            status = event.Records[0].Sns.Message.status;
            switch (status) {
                case "Succeeded":
                    severity = "good";
                    group = event.Records[0].Sns.Message.deploymentGroupName;
                    message = util.format("The configuration files have been successfully deployed to %s", group);
                    break;
                case "Failed":
                    severity = "danger";
                    errorInfo = event.Records[0].Sns.Message.errorInformation;
                    message = util.format("%s: %s", errorInfo.ErrorCode, errorInfo.ErrorMessage);
                    break;
            }
            break;
        case "Sample_Mobile_Config_Instance_Failure_Trigger":
            severity = "danger";
            instanceId = event.Records[0].Sns.Message.instanceId.split("/")[1];
            message = util.format("There is a problem with the following EC2 instance: %s", instanceId);
            break;
    }

    postData.attachments = [
        {
            "color": severity,
            "text": message
        }
    ];

    var options = {
        method: 'POST',
        hostname: 'hooks.slack.com', 
        port: 443,
        path: '/services/<replace-with-slack-webhook-url>'
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            context.done(null);
        });
    });

    req.on('error', function(e) {
        console.log('ERROR: Problem with request: ' + e.message);
    });

    req.write(util.format("%j", postData));

    req.end();
}