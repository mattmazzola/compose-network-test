# Container Network Test

This project attempts to test network communication through containers using docker compose

- API
  - Exposes 
  - `docker build -t cnt-api .`
  - `docker run -it --rm -p 3002:3002 -e HOST=127.0.0.1 -e PORT=3002 cnt-api`
- DB Node
  - `docker build -t cnt-db .`
  - `docker run -it --rm -p 3003:3003 -e HOST=0.0.0.0 -e PORT=3003 cnt-db`

- Docker Compose
  - `docker compose up --build`

## Notes

- Docker internal
  - `http://host.docker.internal`
- Docker Network
  - Ping
    - `docker exec -it compose-network-test-api-1 ping compose-network-test-db-1`
    - https://tjtelan.com/blog/how-to-link-multiple-docker-compose-via-network/
    
## Logs of Successful Component Loading

```
loading components
found component. name: statestore, type: state.redis/v1
loading component. name: statestore, type: state.redis/v1
waiting for all outstanding components to be processed
component loaded. name: statestore, type: state.redis/v1
all outstanding components processed
```