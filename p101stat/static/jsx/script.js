/** @jsx React.DOM */

(function($, window) {



}).call(this, jQuery, window);

var IdolTabDiv = React.createClass({
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
      <div className="row-fluid">
        <div className="col-xs-4 pull-right">
          <IdolPanel idol={this.state.idolData.objects[this.state.selectedIndex]} />
        </div>
        <div className="col-xs-8">
          <div className="table-responsive" style={{height: "600px", overflowY: "scroll"}}>
            <RankTable idols={this.state.idolData.objects} selectedIndex={this.state.selectedIndex} onClick={this.handleIdolSelect}/>
          </div>
        </div>
      </div>
    );
  }
});

var RankTable = React.createClass({
  render: function() {
    var rankRows = this.props.idols.map(function(idol, i) {
      return (
        <RankRow key={idol.id} idol={idol} selectedIndex={this.props.selectedIndex} index={i} onClick={this.props.onClick.bind(null, i)} />
      );
    }.bind(this));
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="text-right">Rank</th>
            <th>(daily change)</th>
            <th>Name</th>
            <th>Agency</th>
            <th>Vote Progress (daily change)</th>
          </tr>
        </thead>
        <tbody>
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
    var rowClass = '';
    if (this.props.selectedIndex == this.props.index)
    {
      rowClass = "success";
    }
    var rank_span;
    var vote_span;
    var rank_change = idol.prev_rank - idol.rank;
    if (rank_change > 0) {
        rank_span = <span style={{color: "green"}}><i className="fa fa-long-arrow-up"></i> {rank_change}</span>;
    }
    else if (rank_change < 0) {
        rank_span = <span style={{color: "red"}}><i className="fa fa-long-arrow-down"></i> {Math.abs(rank_change)}</span>;
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
    else {
      vote_span = <span>{vote_change.toFixed(2)}</span>
    }
    return (
      <tr className={rowClass} onClick={this.props.onClick}>
        <th className="text-right">{idol.rank}</th>
        <td>({rank_span})</td>
        <td>{idol.name_kr} {name_en}</td>
        <td>{idol.agency}</td>
        <td>{idol.vote_percentage.toFixed(2)}% ({vote_span})</td>
      </tr>
    );
  }
});

var IdolPanel = React.createClass({
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
        <div className="panel panel-default">
          <div className="panel-heading"><h3>#{idol.rank} - {idol.name_kr} {name_en}</h3></div>
          <div className="panel-body">
            <img className="img-responsive center-block img-circle" src={img_url} alt={idol.name_kr} height="300" width="300" />
          </div>
          <table className="table">
            <tbody>
              <tr>
                <td colSpan="2" className="col-xs-4">
                  <div className="progress" style={{marginBottom: "0"}}>
                    <div className="progress-bar" role="progressbar" aria-valuenow={idol.vote_percentage.toFixed(0)} ariaValuemin="0" ariaValuemax="100" style={{width: idol.vote_percentage.toFixed(0) + '%', minWidth: "4em"}}>{idol.vote_percentage.toFixed(2)}%</div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="col-xs-1 text-right">Age</th><td className="col-xs-3">{idol.age}</td>
              </tr>
              <tr>
                <th className="col-xs-1 text-right">Agency</th><td className="col-xs-3">{idol.agency}</td>
              </tr>
              <tr>
                <td className="text-center" colSpan="2">{idol.comment}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    else
    {
      return (<div></div>);
    }
  }
});

ReactDOM.render(
  <IdolTabDiv idol_url="/api/idols" />,
  document.getElementById('idol-live-tab')
);
