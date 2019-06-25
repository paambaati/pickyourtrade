# Problem Statement

The task is to build a Portfolio Tracker app.

It has 2 main features:

1. Search tickers and find details about a company
2. Logged in users being able to track the tickers they are subscribed to.
 
## Screens

1. Landing page screen – A search box that allows to search company names via Full Name or ticker. e.g. GOOG or Google, MSFT or Microsoft. Etc. The search results from autocomplete only lead to a company screen.
2. Company screen – This screen shows Company’s current stock price(with time), day high, day low, 52 week high, 52 week low, Day open, day close (if closed), graphs can be ignored at the moment. Reference: Google finance’s company page. It also has features like add/remove ticker from your tracker (only for logged in users). Add feature lets user add no of stocks along with bought at/purchase price.
3. Portfolio tracker screen – Login option is on the right hand corner on the homepage. Logged in users directly land in to portfolio tracking screen which shows a table of tickers with detailed information on tickers tracked by a user and has following columns

```
Ticker
Company Name
Market Cap
Exchange
Day high
Day low
52 week high
52 week low
Day Open
Day Close (if closed)
Latest price (with last updated)
Total stocks held
Total Purchase price
Total Current Value
Profit as on date.
```
This table also allows editing total stocks held and the Total Purchase price. Also allows removal of the stock.

## Additional Details

1. Login: You may hardcode the login credentials at the moment, allow 1-2 users, registration in not needed at this point.

2. Ticker data: You may use the alphavantage API for this purpose. Sample api call here. Key included in the link.

3. Search feature: You may chose the alphavantage API or use your own API’s to build this feature.

4. Scaling: The solution has to scale for 1000 concurrent users easily.

You may choose the tech stack that you prefer, in order to build this.
