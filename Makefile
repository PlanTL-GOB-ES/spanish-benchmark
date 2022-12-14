API_URL ?= https://https://bscplantl01.bsc.es/evales/api/results
serve:
	rm -rf ./spanish-benchmark && make build && gulp connect
build:
	API_URL=$(API_URL) gulp all
