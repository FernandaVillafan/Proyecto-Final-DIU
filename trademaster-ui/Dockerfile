# Source Image: https://catalog.redhat.com/software/containers/ubi8/nodejs-16-minimal/615aefd53f6014fa45ae1ae2?container-tabs=overview
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:1-89

# Fix CVEs through upgrades
# nodemon has an unpatched CVE as of 18 Jan 2023
USER root
RUN microdnf update -y && npm remove -g nodemon
USER 1001

# Add build
COPY --chown=1001:0 . .

RUN npm install 

# Run script uses standard ways to run the application
CMD ["sh","-c","npm run start"]
## CMD ["npm","run","build","&&","serve","-s","build"]
# ./replace_service_desk_urls.sh replaces urls strings in "servicedesk.bundle.js" file with environment variable values
#CMD ["sh","-c","npm run build && ./replace_service_desk_urls.sh && serve -s build"]
# CMD [ "npm", "run", "-d", "dev"]
# CMD [ "npm", "run", "dev", "--", "--host"]