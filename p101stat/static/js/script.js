(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */

(function($, window) {



}).call(this, jQuery, window);

var RankDiv = React.createClass({displayName: "RankDiv",
  loadCommentsFromServer: function() {
    var now = new Date;
    var month = now.getUTCMonth() + 1;
    var idol_payload = {
      "order_by": [{"field": "vote_percentage", "direction": "desc"}]
    };
    var history_payload = {
      "filters": [
        {"name": "date", "op": "eq", "val": now.getUTCFullYear() + '-' + month + '-' + now.getUTCDate()}
      ],
      "order_by": [{"field": "idol_id", "direction": "asc"}]
    };
    $.ajax({
      url: this.props.idol_url,
      data: {"q": JSON.stringify(idol_payload), "results_per_page": 101},
      dataType: 'json',
      contentType: "application/json",
      cache: false,
      success: function(result) {
        this.setState({idol_data: result});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    $.ajax({
      url: this.props.history_url,
      data: {"q": JSON.stringify(history_payload), "results_per_page": 101},
      dataType: 'json',
      contentType: "application/json",
      cache: false,
      success: function(result) {
        this.setState({history_data: result});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {idol_data: {"objects": []}};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
        React.createElement(RankTable, {idols: this.state.idol_data.objects})
    );
  }
});

var RankTable = React.createClass({displayName: "RankTable",
  render: function() {
    var history = this.props.history;
    var rankRows = this.props.idols.map(function(idol, rank) {
      return (
        React.createElement(RankRow, {key: idol.id, idol: idol, rank: rank + 1})
      );
    });
    return (
      React.createElement("table", {className: "table"}, 
        React.createElement("tbody", null, 
          React.createElement("tr", null, 
            React.createElement("th", null, "Rank (daily change)"), 
            React.createElement("th", null, "Name"), 
            React.createElement("th", null, "Agency"), 
            React.createElement("th", null, "Votes (daily change)")
          ), 
          rankRows
        )
      )
    );
  }
});

var RankRow = React.createClass({displayName: "RankRow",
  loadCommentsFromServer: function() {
    var now = new Date;
    var month = now.getUTCMonth() + 1;
    var history_payload = {
      "filters": [
        {"name": "date", "op": "eq", "val": now.getUTCFullYear() + '-' + month + '-' + now.getUTCDate()},
        {"name": "idol_id", "op": "eq", "val": this.props.idol.id}
      ],
      "order_by": [{"field": "idol_id", "direction": "asc"}]
    };
    $.ajax({
      url: '/api/daily_history',
      data: {"q": JSON.stringify(history_payload), "results_per_page": 101},
      dataType: 'json',
      contentType: "application/json",
      cache: false,
      success: function(result) {
        this.setState({history_data: result});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {history_data: {"objects": []}};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    var idol = this.props.idol;
    var history = this.state.history_data.objects;
    var name_en = '';
    if (idol.last_name_en && idol.first_name_en) {
      name_en = ' (' + idol.last_name_en + idol.first_name_en + ')';
    }
    var rank_span;
    var vote_span;
    if (history.length > 0)
    {
      var rank_change = history[0].rank - this.props.rank;
      if (rank_change > 0) {
        rank_span = React.createElement("span", {style: {color: "green"}}, React.createElement("i", {className: "fa fa-long-arrow-up"}), " ", rank_change);
      }
      else if (rank_change < 0) {
        rank_span = React.createElement("span", {style: {color: "red"}}, React.createElement("i", {className: "fa fa-long-arrow-down"}), " ", rank_change);
      }
      else {
        rank_span = React.createElement("i", {className: "fa fa-arrows-h"});
      }

      var vote_change = idol.vote_percentage - history[0].vote_percentage;
      if (vote_change > 0) {
        vote_span = React.createElement("span", {style: {color: "green"}}, "+", vote_change.toFixed(2));
      }
      else if (vote_change < 0) {
        vote_span = React.createElement("span", {style: {color: "red"}}, vote_change.toFixed(2));
      }
    }
    return (
      React.createElement("tr", null, 
        React.createElement("td", null, this.props.rank, " (", rank_span, ")"), 
        React.createElement("td", null, 
          idol.name_kr, name_en
        ), 
        React.createElement("td", null, idol.agency), 
        React.createElement("td", null, idol.vote_percentage.toFixed(2), "% (", vote_span, ")")
      )
    );
  }
});

ReactDOM.render(
  React.createElement(RankDiv, {idol_url: "/api/idols", history_url: "/api/daily_history"}),
  document.getElementById('rank-table')
);


},{}]},{},[1])