<template>
  <section id="tracker" class="section">
    <header class="header">
      <h1 class="title">Portfolio Tracker <b-button @click="reloadPortfolio()" icon-right="refresh"/></h1>
    </header>
    <main role="content" class="content">
        <b-table
            :data="tableData"
            :columns="columns"
            :loading="isFetching"
            :striped="true"
            :narrowed="true"
            :mobile-cards="true"
            :paginated="true"
            :per-page="10"
            detailed
            detail-key="id"
            @details-open="row => collapseEveryOtherRow(row)"
            :opened-detailed="defaultOpenedTickers"
            :show-detail-icon="true"
            hoverable
        >
          <template slot="detail" v-bind:modifiedRow="this.modifiedRow">
            <article class="media">
                <div class="media-content">
                  <section role="modify" class="content">
                    <b-field horizontal label="Modify your order">
                      <b-input v-model.number="modifiedRow.stockCount" placeholder="Stocks" type="number" icon="counter" expanded></b-input>
                      <b-input v-model.number="modifiedRow.stockPurchasePrice" placeholder="Purchase Price" type="number" icon="cash-multiple" step="0.01" expanded></b-input>
                      <b-button native-type="button" class="is-success" icon-left="update" v-on:click="modifyTicker();">Update</b-button>
                    </b-field>
                  </section>
                </div>
            </article>
          </template>
        </b-table>
    </main>
  </section>
</template>
<script>
export default {
  name: 'tracker',
  mounted() {
    this.loadPortfolio();
  },
  computed: {
    thisContext() {
      return this;
    }
  },
  methods: {
    loadPortfolio() {
      this.fetchFailed = false;
      this.isFetching = true;
      this.$store
        .dispatch('getPortfolio')
        .then(() => {
          this.tableData = [
            ...this.$store.getters.portfolio,
          ];
        })
        .catch(err => {
          this.$toast.open({
              duration: 5000,
              message: `😲 Something went wrong trying to load your portfolio! (${err})`,
              type: 'is-danger'
          });
          this.fetchFailed = false;
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
    reloadPortfolio() {
      this.tableData = [];
      this.loadPortfolio();
    },
    addTickerToPortfolio() {
      this.$store
        .dispatch('addToPortfolio', this.$store.getters.lastAdded)
        .catch(err => {
          this.$toast.open({
              duration: 5000,
              message: `😲 Something went wrong trying to add the ticker to your portfolio! (${err})`,
              type: 'is-danger'
          });
          this.fetchFailed = false;
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
    modifyTicker() {
      // eslint-disable-next-line
      console.log('MODIFYING TICKER -> ', this.modifiedRow);
      this.$store
        .dispatch('updatePortfolio', this.modifiedRow)
        .then(result => {
          if (result.success) {
            this.defaultOpenedTickers.pop();
            this.$toast.open({
              message: `👍🏻 Updated your order for ${result.updated.ticker}!`,
              type: 'is-success'
            });
            // eslint-disable-next-line
            console.log('final post-update portfolio = ', this.$store.getters.portfolio);
            this.tableData = this.$store.getters.portfolio;
          }
        })
        .catch(err => {
          this.$toast.open({
              duration: 5000,
              message: `😲 Something went wrong trying to update your portfolio! (${err})`,
              type: 'is-danger'
          });
          this.fetchFailed = false;
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
    collapseEveryOtherRow(row) {
      this.modifiedRow = {...row};
      this.defaultOpenedTickers.pop(); // Collapse the previously opened ticker if any.
      this.defaultOpenedTickers = [row.id]; // Now set the opened ticker to the present one. TODO: This logic is brittle as we're relying on the DB's row index instead of the table's; this is a stop-gap until the Buefy project fixes it.
    }
  },
  data() {
    return {
      fetchFailed: false,
      isFetching: false,
      defaultOpenedTickers: [],
      modifiedRow: {},
      tableData: [],
      columns: [
        {
          field: "id",
          label: "ID",
          visible: false,
        },
        {
          field: "username",
          label: "User",
          visible: false,
        },
        {
          field: "ticker",
          label: "Ticker",
          sortable: true,
        },
        {
          field: "company",
          label: "Company",
          sortable: true,
        },
        {
          field: "region",
          label: "Region",
          sortable: true,
        },
        {
          field: "high",
          label: "High",
          numeric: true,
          sortable: true,
        },
        {
          field: "low",
          label: "Low",
          numeric: true,
          sortable: true,
        },
        {
          field: "open",
          label: "Open",
          numeric: true,
          sortable: true,
        },
        {
          field: "close",
          label: "Close",
          numeric: true,
          sortable: true,
        },
        {
          field: "currentPrice",
          label: "Latest Price",
          numeric: true,
          sortable: true,
        },
        {
          field: "lastRefreshed",
          label: "Refreshed",
          sortable: true,
        },
        {
          field: "stockCount",
          label: "Stocks Held",
          numeric: true,
          sortable: true,
        },
        {
          field: "stockPurchasePrice",
          label: "Purchase Price",
          numeric: true,
          sortable: true,
        },
        {
          field: "totalValue",
          label: "Total Value",
          numeric: true,
          sortable: true,
        },
        {
          field: "profit",
          label: "Profit",
          numeric: true,
          sortable: true,
        }
      ]
    };
  }
};
</script>

<style scoped>
main.content {
  margin-top: 1em;
}
</style>
<style>
ul.pagination-list {
    list-style: none !important;
    margin-left: 0 !important;
    margin-top: 0 !important;
}
</style>
