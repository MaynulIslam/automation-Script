const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const formidable = require('formidable');

const { client } = require("../../util/common");
const common = require('../../util/common');
const constant = require('../../util/constant');

const softwareUpdateService = async (request, response) => {
  console.info("update.service -> softwareUpdateService");
  try {
      client.publish("SOFTWARE_UPDATE", JSON.stringify({ status: "inprogress", percent_completed: 5, message: 'Uploading files' }))
      const uploadDir = constant.appConfig.MEDIA_UPLOAD_DIR || path.join(process.cwd(), '/tmp');
      let form = formidable({ uploadDir: uploadDir, multiples: false });
      form.parse(request, async (err, fields, files) => {
          if (err) {
              common.errorMessage('Software Update: Error in uploading file!')
              console.log(err)
              return common.sendResponse(response, constant.fileUploadMessages.ERROR_IN_FILE_UPLOAD_INTERNAL_ERROR, false, 500)
          }
          common.successMessage('Software Update: File upload Success!')

          try {
              client.publish("SOFTWARE_UPDATE", JSON.stringify({ status: "inprogress", percent_completed: 15, message: 'File successfully uploaded. Getting file information' }))

              if (files && files.files && files.files.name && files.files.name.length > 0 && files.files.name.includes('.enc')) {
                  const projectRoot = process.cwd();
                  const new_file_full_path = path.join(projectRoot, '/tmp/duettoanalytics.enc');
                  console.info('File path:', new_file_full_path);
                  
                  fs.rename(files.files.path, new_file_full_path, function (err) {
                      if (err) {
                          common.errorMessage('Software Update: Error in renaming file!')
                          console.log(err)
                          return common.sendResponse(response, constant.updateMessages.ERROR_IN_RENAMING_FILE, false, 200)
                      }
                      common.successMessage('Software Update: File Successfully renamed!')
                      client.publish("SOFTWARE_UPDATE", JSON.stringify({ status: "inprogress", percent_completed: 37, message: 'Working on Update' }))

                      client.publish("UPDATE_PROCEDURE", JSON.stringify({ update_started: true, file_full_path: new_file_full_path }))
                      return common.sendResponse(response, constant.updateMessages.STARTED_WORKING_ON_UPDATE_PROCEDURE, true, 200)
                  });
              } else {
                  return common.sendResponse(response, constant.updateMessages.ERROR_INVALID_REQUEST_TO_UPDATE_SOFTWARE, false, 200)
              }
          } catch (error) {
              console.error('error',error);
              return common.sendResponse(response, constant.updateMessages.ERROR_IN_UPDATING_SOFTWARE, false, 500)
          }
      })
  } catch (error) {
      console.error("Error occured in softwareUpdateService------------------------------->", error)
      return common.sendResponse(response, constant.fileUploadMessages.ERROR_IN_FILE_UPLOAD_INTERNAL_ERROR, false, 500)
  }
}

client.subscribe("UPDATE_PROCEDURE")

client.on('message', (topic, message) => {
    switch (topic) {
        case "UPDATE_PROCEDURE":
            common.bootMessage("Working on Update Procedure")
            const updateConfig = JSON.parse(message);
            console.log("updateConfig------------------------------------>", updateConfig)
            common.bootMessage('Decrypting file ...');

            client.publish("SOFTWARE_UPDATE", JSON.stringify({ status: "inprogress", percent_completed: 45, message: 'Working on Update' }))
            exec(`openssl aes-256-cbc -md sha512 -pbkdf2 -iter 100000 -salt -d -in ${updateConfig.file_full_path} -out /home/maestro/duetto-analytics/tmp/duettoanalytics.tar.gz -pass file:/home/maestro/duetto-analytics/backend/server/security/maestro_private.key`, { maxBuffer: 1024 * 500000 }, (error, stdout, stderr) => {
                if (error) {
                    common.errorMessage('Error in Decrypting files')
                    console.error(`Error from exec: ${error}`);
                    return;
                }
                common.successMessage('File Successfully decrypted!')

                common.bootMessage('Extracting files ...')
                client.publish("SOFTWARE_UPDATE", JSON.stringify({ status: "inprogress", percent_completed: 80, message: 'Working on Update' }))
                
                // Updating flag
                // mainServerObj.update_started = true;

                // Pre-unzip prepare old state
                exec(`
rm -rf /tmp/duettoanalytics && 
mkdir /tmp/duettoanalytics && 
for dir in /home/maestro/duetto-analytics/*; do 
  if [ "$dir" != "/home/maestro/duetto-analytics/node_modules" ] && 
     [ "$dir" != "/home/maestro/duetto-analytics/backend/server/security" ]; then 
    cp -r "$dir" /tmp/duettoanalytics/; 
  fi; 
done`,{ maxBuffer: 1024 * 500000 }, (error, stdout, stderr) => {
                    if (error) {
                        common.errorMessage('Error from pre-unzip exec')
                        console.error(`Error from pre-unzip exec: ${error}`);
                    }
                    
                    exec('tar -xzf /home/maestro/duetto-analytics/tmp/duettoanalytics.tar.gz -C /home/maestro/duetto-analytics/', { maxBuffer: 1024 * 500000 }, (error, stdout, stderr) => {
                        if (error) {
                            common.errorMessage('Error in Extracting files')
                            console.error(`Error from exec: ${error}`);
                            handleUpdateError();// Revert to old state if error occoured
                            return;
                        }
                        common.successMessage('Files successfully extracted and updated!');
                        handleUpdateSuccess(); //async 
                        client.publish("SOFTWARE_UPDATE", JSON.stringify({ status: "inprogress", percent_completed: 100, message: 'Successfully Updated! Rebooting the device. Please wait for 1 minute.' }))
                        exec(`pm2 restart all`, { maxBuffer: 1024 * 500000 }, (error, stdout, stderr) => {
                            if (error) {
                                common.errorMessage('Error in Restarting service')
                                console.error(`Error from exec: ${error}`);
                                return;
                            }
                            return;
                        });
                    });
                })
            });
            break;
    }
    return true;
})

const handleUpdateError = async () => {
    exec('rm -rf /home/maestro/duetto-analytics/tmp/*', { maxBuffer: 1024 * 500000 }, (error, stdout, stderr) => {
        if (error) {
            common.errorMessage('Error reverting')
            console.error(`Error from exec: ${error}`);
            return;
        }
        console.info("update procedure error")
        return;
    });
}

const handleUpdateSuccess = async () => {
    exec('rm -rf /home/maestro/duetto-analytics/tmp/*', { maxBuffer: 1024 * 500000 }, (error, stdout, stderr) => {
        if (error) {
            common.errorMessage('Error reverting')
            console.error(`Error from exec: ${error}`);
            return;
        }
        console.info("update procedure success")
        return;
    });
}

module.exports = {
  softwareUpdateService: softwareUpdateService
}