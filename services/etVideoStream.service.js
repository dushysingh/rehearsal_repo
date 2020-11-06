const config = require("../config/config");

//Create a S3 object and configure it as per credentials
const AWS = require('aws-sdk');

//Create a object that contains access keys
let credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

//Create an Object to start the transcoding Job.
let Etrans = new AWS.ElasticTranscoder({
    apiVersion: '2012–09–25', //Different API versions are provided by s3
    region: 'us-east-1', //Bucket Region
    credentials: credentials,
    videoBucket: 'Bucket_Name',
});

module.exports.ETransCreateJob = (req, res) => { // Send Mail
    return new Promise(async (resolve, reject) => {

        try {

            //Create a JSON object to be passed as parameter
            var params = {
                PipelineId: pipelineId, //PipelineId of Elastic transcoder
                OutputKeyPrefix: newKey + '/',
                Input: {
                    Key: srcKey,  //Source path of video 
                    FrameRate: 'auto',
                    Resolution: 'auto',
                    AspectRatio: 'auto',
                    Interlaced: 'auto',
                    Container: 'auto'
                },
                Outputs: [{
                    Key: 'transcoded/video',
                    PresetId: 'Preset_ID',
                    "SegmentDuration": '3', //Duration in segment on which transcoding is done as we chose HLS streaming
                    ThumbnailPattern: 'poster-{count}', //It is used to create snapshot of Video
                }]
            }

            //To create a new Job

            Etrans.createJob(params, function (err, data) {
                if (err) {
                    console.log('error is :', err);
                }
                else {
                    console.log('data is', data);
                }
            });

        } catch (ex) {
            console.log("aws etranscoder function error", ex)
        }
    });
};

module.exports.ETransReadJob = (req, res) => { // Send Mail
    return new Promise(async (resolve, reject) => {

        try {

            // Transcoding Job can take some time so you need to add ReadJob to check status.

            Etrans.readJob({ Id: data.transcodeId }, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log(data)
                }
            })

        } catch (ex) {
            console.log("aws etranscoder function error", ex)
        }
    });
};