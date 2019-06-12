<template>
  <section id="search" class="section">
    <header class="header">
      <h1 class="title">Search</h1>
    </header>
    <main class="content">
      <div class="columns">
        <div class="column">
          <b-field label="Type in a company's name or stock symbol.">
              <b-autocomplete
                  :data="searchData"
                  placeholder="e.g. AAPL or Apple"
                  field="title"
                  :loading="isSearching"
                  @typing="searchForSymbol"
                  @select="option => selected = option">
                  <template slot="empty">😲 No companies found!</template>
                  <template slot-scope="props">
                      <div class="media">
                          <div class="media-content">
                              {{ props.option['1. symbol'] }}
                              <br>
                              <small>
                                  <strong>{{ props.option['2. name'] }}</strong> ({{ props.option['4. region'] }})
                              </small>
                          </div>
                      </div>
                  </template>
              </b-autocomplete>
          </b-field>
        </div>
        <div class="column">
          <div class="card" v-if="selected">
            <b-loading :is-full-page="false" :active.sync="isFetching" :can-cancel="false"></b-loading>
            <div class="card-content">
              <p class="title">
                {{ selected['1. symbol'] }}
              </p>
              <p class="subtitle">
                {{ selected['2. name'] }} ({{ selected['4. region']}})
              </p>
              <b-field grouped group-multiline>
                <div class="control">
                    <b-taglist attached>
                        <b-tag type="is-dark" size="is-medium">{{ selected['8. currency'] }}</b-tag>
                        <b-tag type="is-success" size="is-medium">{{ tickerData.currentPrice }}</b-tag>
                    </b-taglist>
                </div>
                <div class="control">
                    <b-taglist attached>
                        <b-tag type="is-dark" size="is-medium">High</b-tag>
                        <b-tag type="is-info" size="is-medium">{{ tickerData.high }}</b-tag>
                    </b-taglist>
                </div>
                <div class="control">
                    <b-taglist attached>
                        <b-tag type="is-dark" size="is-medium">Low</b-tag>
                        <b-tag type="is-info" size="is-medium">{{ tickerData.low }}</b-tag>
                    </b-taglist>
                </div>
              </b-field>
              <b-field grouped group-multiline>
                <div class="control">
                    <b-taglist attached>
                        <b-tag type="is-dark">Open</b-tag>
                        <b-tag type="is-info">{{ tickerData.open }}</b-tag>
                    </b-taglist>
                </div>
                <div class="control">
                    <b-taglist attached>
                        <b-tag type="is-dark">Close</b-tag>
                        <b-tag type="is-info">{{ tickerData.close }}</b-tag>
                    </b-taglist>
                </div>
              </b-field>
              <small><b-icon icon="clock" size="is-small"/>Last refreshed at {{ tickerData.lastRefreshed }} ({{ selected['7. timezone'] }})</small>
            </div>
            <footer class="card-footer">
              <p class="card-footer-item">
                <span v-if="isLoggedIn">
                  <section role="add">
                    <b-field horizontal custom-class="invisible">
                      <b-input v-model.number="stockCount" placeholder="Stocks" type="number" icon="counter" expanded></b-input>
                      <b-input v-model.number="stockPurchasePrice" placeholder="Purchase Price" type="number" step="0.01" icon="cash-multiple" expanded></b-input>
                      <b-button native-type="button" class="is-success" icon-left="plus" v-on:click="addToPortfolio()">Add</b-button>
                    </b-field>
                  </section>
                </span>
                <span v-else>
                  <router-link to="/login" tag="button" class="button is-primary is-small">
                  <b-icon icon="account" size="is-small"/>&nbsp;&nbsp;Login
                  </router-link> to add this to your portfolio!
                </span>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<script>
    import debounce from 'lodash/debounce';

    export default {
      name: 'search',
      computed: {
        isLoggedIn: function() {
          return this.$store.getters.isLoggedIn;
        },
      },
      data() {
          return {
              searchData: [],
              tickerData: {},
              selected: null,
              stockCount: null,
              stockPurchasePrice: null,
              isSearching: false,
              isFetching: false,
          }
      },
      watch: {
        selected: function (newTicker) {
          this.fetchTicker(newTicker['1. symbol']);
        },
      },
      methods: {
        addToPortfolio: function() {
          this.$store
          .dispatch('addToPortfolio', {
            selected: this.selected,
            tickerData: this.tickerData,
            stockCount: this.stockCount,
            stockPurchasePrice: this.stockPurchasePrice,
          })
          .then(() => this.$router.push('/tracker'))
          .catch(err => {
            this.$toast.open({
              duration: 5000,
              message: `😲 Something went wrong trying to add the ticker to your portfolio! (${err})`,
              type: 'is-danger'
            });
          });
        },
        searchForSymbol: debounce(function(name) {
            if (!name.length) {
                this.searchData = [];
                return;
            }
            this.isSearching = true;
            
            this.$http.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(name)}&apikey=UJR6SSQXGUIQ1LJL`, {
              withCredentials: false,
            })
                .then(({ data }) => {
                    this.searchData = [];
                    data.bestMatches.forEach((item) => this.searchData.push(item));
                })
                .catch((error) => {
                    this.searchData = [];
                    throw error;
                })
                .finally(() => {
                    this.isSearching = false;
                });
        }, 500),
        fetchTicker: function(name) {
            if (!name.length) {
                this.tickerData = {};
                return;
            }
            this.isFetching = true;
            this.$http.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(name)}&interval=5min&apikey=UJR6SSQXGUIQ1LJL`, {
              withCredentials: false,
            })
                .then(({ data }) => {
                    const lastRefreshed = data['Meta Data']['3. Last Refreshed'];
                    const dataPoints = data['Time Series (5min)'][lastRefreshed];
                    this.tickerData = {
                      currentPrice: dataPoints['4. close'],
                      lastRefreshed,
                      high: dataPoints['2. high'],
                      low: dataPoints['3. low'],
                      open: dataPoints['1. open'],
                      close: dataPoints['4. close'],
                    };
                })
                .catch((error) => {
                    this.tickerData = {};
                    throw error;
                })
                .finally(() => {
                    this.isFetching = false;
                });
            },
        },
    }
</script>

<style scoped>
.card-content small {
  font-size: 0.6em;
}
</style>
<style>
.invisible {
  display: none !important;
}
</style>
