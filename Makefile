LIGO_VERSION=0.73.0
LIGO=docker run --rm -v "C:\Users\alexh\OneDrive\Bureau\ESGI\5eme annee\Tezos\tezos_cameligo":/home/usr/ligo -w /home/usr/ligo ligolang/ligo:$(LIGO_VERSION)

###################################

help:
	@echo "Ceci est la section d'aide"

###################################

compile:
	@echo "Compiling Tezos Contract..."
	@$(LIGO) compile contract contracts/main.mligo --output-file compiled/main.tz
	@$(LIGO) compile contract contracts/main.mligo --michelson-format json --output-file compiled/main.json

###################################

test:
	@echo "Running tests on Tezos Contract..."
	@$(LIGO) run test ./tests/ligo/main.test.mligo