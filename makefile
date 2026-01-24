.PHONY: help dev dev-frontend dev-storybook dev-backend down logs clean

help:
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev:
	docker compose up --build

dev-app:
	docker compose up --build app

dev-testable:
	docker compose up --build testable
	
down:
	docker compose down

logs:
	docker compose logs -f

logs-app:
	docker compose logs -f app

logs-testable:
	docker compose logs -f testable

clean:
	docker compose down -v --rmi all

# Pattern rule for make dev:[service] syntax
dev-%:
	@service=$$(echo $@ | sed 's/dev-//'); \
	docker compose up --build $$service

