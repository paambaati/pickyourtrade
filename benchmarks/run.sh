#!/bin/bash

DURATION="1s"

if ! [ -x "$(command -v vegeta)" ]; then
  echo 'Error: vegeta is not installed. Read https://github.com/tsenart/vegeta#install for installation instructions.' >&2
  exit 1
fi

rm -rf results/*.bin results/*.html

echo "Running INSERT Benchmarks..."
vegeta attack -duration=${DURATION} -rate=1000 -max-body=0 -targets=inputs/insert-portfolio.txt | tee results/insert.bin
echo "INSERT Benchmark Results"
cat results/insert.bin | vegeta report
cat results/insert.bin | vegeta plot -title="PickYourTrade/SQLite3 WRITE Benchmark"> results/insert.html
echo "Plotted results available at results/insert.hml"

# Now clear data and then insert some data for the read benchmarks.
echo "Clearing DB..."
rm -rf ../data/pyt.db*
echo "Inserting some sample data for READ benchmarks..."
vegeta attack -duration=${DURATION} -rate=100 -max-body=0 -targets=inputs/insert-portfolio.txt

echo "Running READ Benchmarks..."
vegeta attack -duration=${DURATION} -rate=1000 -max-body=0 -targets=inputs/read-portfolio.txt | tee results/read.bin
echo "READ Benchmark Results"
cat results/read.bin | vegeta report
cat results/read.bin | vegeta plot -title="PickYourTrade/SQLite3 READ Benchmark" > results/read.html
echo "Plotted results available at results/read.hml"
