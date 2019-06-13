-- Up 
CREATE TABLE `portfolios` (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username STRING NOT NULL, -- perhaps add an index here as we scale?
    ticker STRING NOT NULL,
    company STRING NOT NULL,
    region STRING NOT NULL,
    high NUMERIC NOT NULL,
    low NUMERIC NOT NULL,
    open NUMERIC NOT NULL,
    close NUMERIC NOT NULL,
    currentPrice NUMERIC NOT NULL,
    lastRefreshed STRING NOT NULL,
    stockCount NUMERIC NOT NULL,
    stockPurchasePrice NUMERIC NOT NULL
);
 
-- Down 
DROP TABLE IF EXISTS `portfolios`;
