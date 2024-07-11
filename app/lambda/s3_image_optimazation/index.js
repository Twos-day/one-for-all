/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const AWS = require('aws-sdk');
const Sharp = require('sharp');
const S3 = new AWS.S3();

exports.handler = async (event) => {
  const { request } = event.Records[0].cf;
  const { uri } = request;

  const queryParams = request.querystring.split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const width = parseInt(queryParams.w || '0', 10);
  const quality = parseInt(queryParams.q || '80', 10);
  const format = uri.split('.').pop().toLowerCase();

  const supportedFormats = ['webp', 'png', 'jpeg', 'jpg'];
  if (!supportedFormats.includes(format)) {
    return {
      status: '400',
      statusDescription: 'Bad Request',
      body: `Unsupported format: ${format}`,
    };
  }

  const s3Params = {
    Bucket: 'your-s3-bucket-name',
    Key: uri.substring(1), // Remove leading '/'
  };

  try {
    const s3Object = await S3.getObject(s3Params).promise();
    let image = Sharp(s3Object.Body);

    const metadata = await image.metadata();

    if (width > 0) {
      const height = Math.round((width * metadata.height) / metadata.width);
      image = image.resize(width, height);
    }

    if (format === 'jpg') {
      format = 'jpeg';
    }

    image = image.toFormat(format, { quality });

    const resizedImage = await image.toBuffer();

    return {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'content-type': [{ key: 'Content-Type', value: `image/${format}` }],
        'cache-control': [{ key: 'Cache-Control', value: 'max-age=31536000' }],
      },
      body: resizedImage.toString('base64'),
      bodyEncoding: 'base64',
    };
  } catch (error) {
    return {
      status: '500',
      statusDescription: 'Internal Server Error',
      body: `Error processing the image: ${error.message}`,
    };
  }
};
