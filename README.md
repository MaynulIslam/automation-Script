
## Design Resources

The UI design for the overview page was created by Cambrian R&D and can be accessed in Figma:
[Maestro R&D Design - Overview Page](https://www.figma.com/design/1vnphe0wKm4VeDZSHnMVzP/Maestro-R%26D?node-id=369-329&p=f&t=dtEKpVsG9GSD0iYS-0)

# Project Setup

This project is designed for deployment using Docker and requires a PostgreSQL database. Follow the steps below to set up the project.

---

## Prerequisites

1. **Docker and Docker Compose**  
   Ensure Docker and Docker Compose are installed on your machine.  
   - [Install Docker](https://docs.docker.com/get-docker/)
   - [Install Docker Compose](https://docs.docker.com/compose/install/)

2. **Node.js and PM2**  
   Install Node.js, and use `npm` to install PM2 globally for process management:
   ```bash
   npm install pm2 -g
   ```

---

## Database Setup

To set up the PostgreSQL database using Docker, refer to the following tutorial:  
[How to Create a PostgreSQL Database in Docker](https://www.commandprompt.com/education/how-to-create-a-postgresql-database-in-docker/)

### Using `compose.yml`

1. Use the provided `compose.yml` file to start the database:
   ```bash
   docker-compose up -d
   ```

   This command will launch the PostgreSQL database in the background as a Docker container, allowing your application to connect to it.

---

## Application Setup

### Copy Configuration

Copy the contents of `ecosystem.config.js` to the root directory of your project.

### Start Application

To start the application in production mode using PM2, run:
```bash
pm2 start ecosystem.config.js --env production
```

This command initializes the application with the configuration specified in `ecosystem.config.js`, managing the app processes in production mode.

---

# Update procedure
archive
git archive --format=tar.gz -o output.tar.gz HEAD

encrypt
openssl aes-256-cbc -md sha512 -pbkdf2 -iter 100000 -salt -in output.tar.gz -out duettoanalytics.enc -pass file:./backend/server/security/maestro_private.key


# Netplan settings
network:
    version: 2
    ethernets:
        eth0:
            dhcp4: false  # Static IP, not using DHCP
            addresses:
              - 192.168.10.195/20  # Static IP address of your choice
            gateway4: 192.168.10.1  # Replace with your default gateway
            nameservers:
                addresses:
                  - 8.8.8.8         # Google DNS
                  - 8.8.4.4         # Secondary Google DNS
                  - 1.1.1.1         # Cloudflare DNS (optional)


## Licensing

©2024 Maestro Digital Mine. All rights reserved.

This project is licensed under a proprietary license. Please contact us for licensing information.
