(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */

(function($, window) {



}).call(this, jQuery, window);

var IdolTabDiv = React.createClass({displayName: "IdolTabDiv",
  loadIdolsFromServer: function() {
    var idol_payload = {
      "order_by": [{"field": "vote_percentage", "direction": "desc"}]
    };
    $.ajax({
      url: this.props.idol_url,
      data: {"q": JSON.stringify(idol_payload), "results_per_page": 101},
      dataType: 'json',
      contentType: "application/json",
      cache: false,
      success: function(result) {
        this.setState({idolData: result});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {idolData: {"objects": []}, selectedIndex: 0};
  },

  componentDidMount: function() {
    this.loadIdolsFromServer();
  },

  handleIdolSelect: function(i, event) {
    this.setState({selectedIndex: i});
  },

  render: function() {
    var i;
    return (
      React.createElement("div", {className: "row-fluid"}, 
        React.createElement("div", {className: "col-xs-4 pull-right"}, 
          React.createElement(IdolPanel, {idol: this.state.idolData.objects[this.state.selectedIndex]})
        ), 
        React.createElement("div", {className: "col-xs-8"}, 
          React.createElement("div", {className: "table-responsive", style: {height: "600px", overflowY: "scroll"}}, 
            React.createElement(RankTable, {idols: this.state.idolData.objects, selectedIndex: this.state.selectedIndex, onClick: this.handleIdolSelect})
          )
        )
      )
    );
  }
});

var RankTable = React.createClass({displayName: "RankTable",
  render: function() {
    var rankRows = this.props.idols.map(function(idol, i) {
      return (
        React.createElement(RankRow, {key: idol.id, idol: idol, selectedIndex: this.props.selectedIndex, index: i, onClick: this.props.onClick.bind(null, i)})
      );
    }.bind(this));
    return (
      React.createElement("table", {className: "table table-hover"}, 
        React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", {className: "text-right"}, "Rank"), 
            React.createElement("th", null, "(daily change)"), 
            React.createElement("th", null, "Name"), 
            React.createElement("th", null, "Agency"), 
            React.createElement("th", null, "Vote Progress (daily change)")
          )
        ), 
        React.createElement("tbody", null, 
          rankRows
        )
      )
    );
  }
});

var RankRow = React.createClass({displayName: "RankRow",
  render: function() {
    var idol = this.props.idol;
    var name_en = '';
    if (idol.last_name_en && idol.first_name_en) {
      name_en = ' (' + idol.last_name_en + ' ' + idol.first_name_en + ')';
    }
    var rowClass = '';
    if (this.props.selectedIndex == this.props.index)
    {
      rowClass = "success";
    }
    var rank_span;
    var vote_span;
    var rank_change = idol.prev_rank - idol.rank;
    if (rank_change > 0) {
        rank_span = React.createElement("span", {style: {color: "green"}}, React.createElement("i", {className: "fa fa-long-arrow-up"}), " ", rank_change);
    }
    else if (rank_change < 0) {
        rank_span = React.createElement("span", {style: {color: "red"}}, React.createElement("i", {className: "fa fa-long-arrow-down"}), " ", Math.abs(rank_change));
    }
    else {
        rank_span = React.createElement("i", {className: "fa fa-arrows-h"});
    }

    var vote_change = idol.vote_percentage - idol.prev_vote_percentage;
    if (vote_change > 0) {
        vote_span = React.createElement("span", {style: {color: "green"}}, "+", vote_change.toFixed(2));
    }
    else if (vote_change < 0) {
        vote_span = React.createElement("span", {style: {color: "red"}}, vote_change.toFixed(2));
    }
    else {
      vote_span = React.createElement("span", null, vote_change.toFixed(2))
    }
    return (
      React.createElement("tr", {className: rowClass, onClick: this.props.onClick}, 
        React.createElement("th", {className: "text-right"}, idol.rank), 
        React.createElement("td", null, "(", rank_span, ")"), 
        React.createElement("td", null, idol.name_kr, " ", name_en), 
        React.createElement("td", null, idol.agency), 
        React.createElement("td", null, idol.vote_percentage.toFixed(2), "% (", vote_span, ")")
      )
    );
  }
});

var IdolPanel = React.createClass({displayName: "IdolPanel",
  render: function() {
    var idol = this.props.idol;
    if (idol !== undefined)
    {
      var name_en = '';
      if (idol.last_name_en && idol.first_name_en) {
        name_en = ' (' + idol.last_name_en + ' ' + idol.first_name_en + ')';
      }
      var img_url="/static/public/img/" + idol.id + "_thumb.jpg";
      return (
        React.createElement("div", {className: "panel panel-default"}, 
          React.createElement("div", {className: "panel-heading"}, React.createElement("h3", null, "#", idol.rank, " - ", idol.name_kr, " ", name_en)), 
          React.createElement("div", {className: "panel-body"}, 
            React.createElement("img", {className: "img-responsive center-block img-circle", src: img_url, alt: idol.name_kr, height: "300", width: "300"})
          ), 
          React.createElement("table", {className: "table"}, 
            React.createElement("tbody", null, 
              React.createElement("tr", null, 
                React.createElement("td", {colSpan: "2", className: "col-xs-4"}, 
                  React.createElement("div", {className: "progress", style: {marginBottom: "0"}}, 
                    React.createElement("div", {className: "progress-bar", role: "progressbar", "aria-valuenow": idol.vote_percentage.toFixed(0), ariaValuemin: "0", ariaValuemax: "100", style: {width: idol.vote_percentage.toFixed(0) + '%', minWidth: "4em"}}, idol.vote_percentage.toFixed(2), "%")
                  )
                )
              ), 
              React.createElement("tr", null, 
                React.createElement("th", {className: "col-xs-1 text-right"}, "Age"), React.createElement("td", {className: "col-xs-3"}, idol.age)
              ), 
              React.createElement("tr", null, 
                React.createElement("th", {className: "col-xs-1 text-right"}, "Agency"), React.createElement("td", {className: "col-xs-3"}, idol.agency)
              ), 
              React.createElement("tr", null, 
                React.createElement("td", {className: "text-center", colSpan: "2"}, idol.comment)
              )
            )
          )
        )
      );
    }
    else
    {
      return (React.createElement("div", null));
    }
  }
});

ReactDOM.render(
  React.createElement(IdolTabDiv, {idol_url: "/api/idols"}),
  document.getElementById('idol-live-tab')
);


},{}]},{},[1])