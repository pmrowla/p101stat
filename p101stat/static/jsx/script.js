/** @jsx React.DOM */

(function($, window) {



}).call(this, jQuery, window);

var RankDiv = React.createClass({
  loadCommentsFromServer: function() {
    var now = new Date;
    var month = now.getUTCMonth() + 1;
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
        this.setState({idol_data: result});
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
        <RankTable idols={this.state.idol_data.objects} />
    );
  }
});

var RankTable = React.createClass({
  render: function() {
    var rankRows = this.props.idols.map(function(idol) {
      return (
        <RankRow key={idol.id} idol={idol} />
      );
    });
    return (
      <table className="table">
        <tbody>
          <tr>
            <th>Rank (daily change)</th>
            <th>Name</th>
            <th>Agency</th>
            <th>Votes (daily change)</th>
          </tr>
          {rankRows}
        </tbody>
      </table>
    );
  }
});

var RankRow = React.createClass({
  render: function() {
    var idol = this.props.idol;
    var name_en = '';
    if (idol.last_name_en && idol.first_name_en) {
      name_en = ' (' + idol.last_name_en + ' ' + idol.first_name_en + ')';
    }
    var rank_span;
    var vote_span;
    var rank_change = idol.prev_rank - idol.rank;
    if (rank_change > 0) {
        rank_span = <span style={{color: "green"}}><i className="fa fa-long-arrow-up"></i> {rank_change}</span>;
    }
    else if (rank_change < 0) {
        rank_span = <span style={{color: "red"}}><i className="fa fa-long-arrow-down"></i> {rank_change}</span>;
    }
    else {
        rank_span = <i className="fa fa-arrows-h"></i>;
    }

    var vote_change = idol.vote_percentage - idol.prev_vote_percentage;
    if (vote_change > 0) {
        vote_span = <span style={{color: "green"}}>+{vote_change.toFixed(2)}</span>;
    }
    else if (vote_change < 0) {
        vote_span = <span style={{color: "red"}}>{vote_change.toFixed(2)}</span>;
    }
    return (
      <tr>
        <td>{idol.rank} ({rank_span})</td>
        <td>{idol.name_kr} {name_en}</td>
        <td>{idol.agency}</td>
        <td>{idol.vote_percentage.toFixed(2)}% ({vote_span})</td>
      </tr>
    );
  }
});

ReactDOM.render(
  <RankDiv idol_url="/api/idols" />,
  document.getElementById('rank-table')
);
