# CodePipeline Integration

This AWS lambda function sents a message to slack when triggered in a CodePipeline.

### Environment configuration

AWS lambda allows to specifiy environment variables. These will be used to sent messages to slack and to customize the appearans inside slack. The following variables can be used

|Name|Description| Required? |
|-----|----------|-----------|
|`API_TOKEN`| The API token provided by slack. It's the part after "services" in the URL (e.g. for  `https://hooks.slack.com/services/TXXXXXXXX/BXXXXXXXX/EUXXXXXXXXXXXXXXXXXXXXXX` it's `TXXXXXXXX/BXXXXXXXX/EUXXXXXXXXXXXXXXXXXXXXXX`) | Yes |
|`EMOJI`| Which emoji to use as profile image for the "bot". Valid are any emojis in the text format, e.g. `:robot_face:` (default) or `:white_check_mark:`. Also works with custom slack emojis!| No |
|`SLACK_USER`| The user name of the bot which will display in Slack.  | No |
|`SLACK_CHANNEL`| The channel or person to sent to. By default the webhook is assigned a channel on creation, this setting overwrites it. Use "channel-name" for channels and "@username" for users. | No |
