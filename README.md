# Mobile App Config Slack Notifications

This sample project utilizes the following Amazon Web Services to send deployment and instance status updates to one or more Slack channels:

* Amazon SNS
* AWS CodeDeploy
* AWS Lambda

### Prerequisites:
* AWS CodeDeploy Trigger(s)
* Amazon SNS Topic(s)
* AWS Lambda Function(s)
* Slack Channel
* Slack Incoming WebHooks Integration

Use the `lambda_slack_notification_blueprint` to create the AWS Lambda function(s) that will post CodeDeploy status notifications to a designated Slack channel.

When SNS sends a notification to the Lambda function, the POST message will contain a JSON document with the following key/value pairs:

 * Message
 * MessageId
 * Signature
 * SignatureVersion
 * SigningCertURL
 * Subject
 * Timestamp
 * TopicArn
 * Type (will be Notification)
 * UnsubscribeURL

The `Message` element will be parsed to determine the appropriate Slack notification to send. Currently, the CodeDeployment statuses of interest are:

* DeploymentSuccess
* DeploymentFailure
* InstanceFailure

### Example SNS Notification
```javascript
{
  "Records": [
    {
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:us-west-2:111222333444:Sample_Mobile_Config_Instance_Status:209b190b",
      "EventSource": "aws:sns",
      "Sns": {
        "SignatureVersion": "1",
        "Timestamp":"2016-07-06T07:36:57.451Z",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "Message": {
            "region": "us-west-2",
            "accountId": "111222333444",
            "eventTriggerName": "Sample_Mobile_Config_Instance_Failure_Trigger",
            "deploymentId": "d-75I7MBT7C",
            "instanceId": "arn:aws:ec2:us-west-2:111222333444:instance/i-496589f7",
            "lastUpdatedAt": "1446744207.564",
            "instanceStatus": "Failed",
            "lifecycleEvents": [
                {
                    "LifecycleEvent": "ApplicationStop",
                    "LifecycleEventStatus": "Succeeded",
                    "StartTime": "1446744188.595",
                    "EndTime": "1446744188.711"
                },
                {
                    "LifecycleEvent": "BeforeInstall",
                    "LifecycleEventStatus": "Succeeded",
                    "StartTime": "1446744189.827",
                    "EndTime": "1446744190.402"
                }
            ]
        },
        "MessageAttributes": {
          "Test": {
            "Type": "String",
            "Value": "TestString"
          },
          "TestBinary": {
            "Type": "Binary",
            "Value": "TestBinary"
          }
        },
        "Type": "Notification",
        "UnsubscribeUrl": "EXAMPLE",
        "TopicArn":"arn:aws:sns:us-west-2:111222333444:Sample_Mobile_Config_Instance_Status",
        "Subject": "Sample Mobile Config Instance Status"
      }
    }
  ]
}
```

### Useful Resources
* [AWS: Managing Triggers for AWS CodeDeploy Event Notifications](http://docs.aws.amazon.com/codedeploy/latest/userguide/how-to-notification-triggers.html?icmpid=docs_acd_console_triggers)
* [AWS: JSON Data Formats for AWS CodeDeploy Triggers](http://docs.aws.amazon.com/codedeploy/latest/userguide/how-to-notify-json-format.html)
* [AWS: Invoking Lambda Functions via SNS](https://mobile.awsblog.com/post/Tx1VE917Z8J4UDY/Invoking-AWS-Lambda-functions-via-Amazon-SNS)
* [AWS: Slack Integration Blueprints for AWS Lambda](https://aws.amazon.com/blogs/aws/new-slack-integration-blueprints-for-aws-lambda/)
* [Blog: Setup Slack Notifications for AWS CodeDeploy](http://mattharris.org/2016/03/21/setup-slack-notifications-aws-codedeploy/)
* [Blog: How to Setup a Slack Channel to Be an AWS SNS Subscriber](https://medium.com/cohealo-engineering/how-set-up-a-slack-channel-to-be-an-aws-sns-subscriber-63b4d57ad3ea)
