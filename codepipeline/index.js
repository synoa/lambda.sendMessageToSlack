/***
 * AWS Lambda funtion to call Slack Incoming Webhooks API to sent messages to a user or channel.
 *
 * Environment configuration:
 *
 * API_TOKEN: The ID you get from slack for your service (the part behind  /services/ in the URL)
 * EMOJI: the emoji which the bot uses as icon
 * SLACK_USER: The bot user name to show
 * SLACK_CHANNEL: The channel or person (@name) to sent the message to
 *
*/
const AWS = require('aws-sdk');
const https = require('https');
const token = process.env.API_TOKEN;
const codepipeline = new AWS.CodePipeline();

exports.handler = function(event, context) {
    'use strict';
    let jobId = "unknown";

    if (event["CodePipeline.job"] && event["CodePipeline.job"].id) {
      jobId = event["CodePipeline.job"].id;
    };


    const data = {
      "username": process.env.SLACK_USER || "aws-lambda-bot",
      "icon_emoji": process.env.EMOJI || ":robot_face:",
      "text": `Pipeline with ID ${jobId} completed.`
    };

    if (event.text != undefined) {
      data.text += `
${event.text}
      `;
    }

    if (process.env.SLACK_CHANNEL != undefined) {
        data.channel = process.env.SLACK_CHANNEL;
    }

    const options = {
      hostname: 'hooks.slack.com',
      port: 443,
      path: '/services/' + token,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      }
    };

    let req = https.request(options, (res) => {
      res.setEncoding('utf8');
    });
    req.on('error', (e) => {
      console.log("Request failed!");
      putJobFailure(e);
    });
    req.on('data', (e) => {
      console.log("Request suceeded: ", e);
      putJobSuccess("Success!");
    });
    // write data to request body
    req.write(JSON.stringify(data));
    req.end();

  // Notify AWS CodePipeline of a successful job
    var putJobSuccess = function(message) {
        var params = {
            jobId: jobId
        };
        codepipeline.putJobSuccessResult(params, function(err, data) {
            if(err) {
                context.fail(err);
            } else {
                context.succeed(message);
            }
        });
    };
    // Notify AWS CodePipeline of a failed job
    var putJobFailure = function(message) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: 'JobFailed',
                externalExecutionId: context.invokeid
            }
        };
        codepipeline.putJobFailureResult(params, function(err, data) {
            context.fail(message);
        });
    };
};
