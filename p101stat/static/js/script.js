(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
$(document).ready(function() {

});

var Bs = window.ReactBootstrap;

var Nav = React.createClass({displayName: "Nav",
  render: function() {
    return (
      React.createElement(Bs.Navbar, {inverse: true, fixedTop: true}, 
        React.createElement(Bs.Navbar.Header, null, 
          React.createElement(Bs.Navbar.Toggle, null), 
          React.createElement(Bs.Navbar.Brand, null, 
            React.createElement("a", {href: "/"}, "Produce 101 Stats")
          )
        ), 
        React.createElement(Bs.Navbar.Collapse, null, 
          React.createElement(Bs.Nav, null, 
            React.createElement(Bs.NavItem, {eventKey: 1, href: "/"}, "Current Rankings")
          )
        )
      )
    );
  }
});

if (null !== document.getElementById('main-nav'))
{
  ReactDOM.render(
    React.createElement(Nav, null),
    document.getElementById('main-nav')
  );
}

var IdolRankDiv = React.createClass({displayName: "IdolRankDiv",
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
    return {idolData: {"objects": []}, selectedIndex: 0, showIdolModal: false};
  },

  componentDidMount: function() {
    this.loadIdolsFromServer();
  },

  handleIdolSelect: function(i, event) {
    this.setState({selectedIndex: i, showIdolModal: true});
  },

  close() {
    this.setState({showIdolModal: false});
  },

  render: function() {
    var i;
    return (
      React.createElement("div", null, 
        React.createElement(IdolModalDialog, {show: this.state.showIdolModal, onHide: this.close, idol: this.state.idolData.objects[this.state.selectedIndex]}), 
        React.createElement(Bs.Row, {fluid: "true"}, 
          React.createElement(Bs.Col, {md: 12}, 
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
      React.createElement(Bs.Table, {hover: true}, 
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
      React.createElement("tr", {type: "button", className: rowClass, onClick: this.props.onClick, "data-toggle": "modal", "data-target": "#idolModal"}, 
        React.createElement("th", {className: "text-right"}, idol.rank), 
        React.createElement("td", null, "(", rank_span, ")"), 
        React.createElement("td", null, idol.name_kr, " ", name_en), 
        React.createElement("td", null, idol.agency), 
        React.createElement("td", null, idol.vote_percentage.toFixed(2), "% (", vote_span, ")")
      )
    );
  }
});

var IdolModalDialog = React.createClass({displayName: "IdolModalDialog",
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
        React.createElement(Bs.Modal, {show: this.props.show, onHide: this.props.onHide}, 
          React.createElement(Bs.ModalHeader, {closeButton: true}, 
            React.createElement(Bs.ModalTitle, null, "#", idol.rank, " - ", idol.name_kr, " ", name_en)
          ), 
          React.createElement(Bs.ModalBody, null, 
            React.createElement(Bs.Row, null, 
              React.createElement(Bs.Image, {circle: true, responsive: true, img: true, className: "center-block", src: img_url, alt: idol.name_kr, height: "300", width: "300"}), 
              React.createElement(Bs.Table, null, 
                React.createElement("tbody", null, 
                  React.createElement("tr", null, 
                    React.createElement("td", {colSpan: "2", className: "col-xs-4"}, 
                      React.createElement("div", {className: "progress", style: {marginBottom: "0"}}, 
                        React.createElement("div", {className: "progress-bar", role: "progressbar", "aria-valuenow": idol.vote_percentage.toFixed(0), "aria-valuemin": "0", "aria-valuemax": "100", style: {width: idol.vote_percentage.toFixed(0) + '%', minWidth: "4em"}}, idol.vote_percentage.toFixed(2), "%")
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

if (null !== document.getElementById('idol-rank-div'))
{
  ReactDOM.render(
    React.createElement(IdolRankDiv, {idol_url: "/api/idols"}),
    document.getElementById('idol-rank-div')
  );
}


},{}]},{},[1])