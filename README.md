WARNING: the license works only if accessed through "mapper.grzybowskigroup.pl" or "localhost".

# Setup:

1 Install Docker
2 Decrypt license file webservices-license-encrypted.cxl with
  ```
  openssl enc -d -aes-256-cbc -pbkdf2 -iter 50000 -in webservices-license-enc.cxl -out webservices-license.cxl
  ```

# Build:

##  you wish to run chem_server (actual mapping service) inside the container:

1. Put chem_server it into this directory as 'chem_server'.
2. Build the image with `docker build -t marvinjs-local -f Dockerfile-with-mapper .` You can provide a build arg MAPPER_PORT if the mapper is listening on different port.
3. Run the image with `docker run -p 8080:8080 -t marvinjs-local`
You can omit the '-p 8080:8080' part if you don't want docker image to bind to all interfaces. Please note that if you omit the -p option it WON'T WORK LOCALLY because MarvinJS license works only for mapper.grzybowskigroup.pl and localhost. It will work for external users who use the public address.

## If you wish to run chem_server outside the container:

1. Build the docker image with `docker build -t marvin --build-arg MAPPER_ADDR=172.17.0.1 --build-arg MAPPER_PORT=2727 .` (both parameters are default
2. run `docker run -p 8080:8080 -t marvin`

What IP address should I use for MAPPER_ADDR? The IP addr the mapper is listening on. It's one of:

* `localhost` - if the mapper is running inside the container
* the address of the host's `docker0` interface if you'r running the mapper in the machine running docker image
* the ip address of the machine running the mapping program


The service should be available on `localhost:8080/marvinjs`. If you haven't used the '-p' option you can see the service's IP address with `docker inspect "$(docker ps -q)" | grep IPAddress`. MarvinJS won't work in this case.


The thing was encrypted with
    ```
    openssl enc -aes-256-cbc -pbkdf2 -iter 50000 -in webservices-license.cxl -out webservices-license-enc.cxl
    ```
