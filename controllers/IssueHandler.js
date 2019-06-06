function IssueHandler() {
  const CONNECTION_STRING = process.env.DB;
  
  this.getAllProjectIssues = (project, query, mongo, res) => {
    mongo.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db(process.env.DB_COLLECTION);
        db.collection(project)
        .find(query).toArray()
        .then(result => {
          client.close();
          res.json(result);
        })
        .catch(err => console.log(err));
    });
  };
  
  this.addNewIssue = (project, issue, mongo, res) => {
    mongo.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db(process.env.DB_COLLECTION);
      
      db.collection(project)
        .findOneAndUpdate(
          {issue_title: issue.issue_title},
          { $set: issue },
          { upsert: true, returnNewDocument: true }
        )
        .then(result => {
          client.close();
          res.json(result.value);
        })
        .catch(err => console.log(err));
      
    });
  };
  
  this.updateIssue = (project, issue, mongo, res) => {
    mongo.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db(process.env.DB_COLLECTION);
      
      db.collection(project)
        .findOneAndUpdate(
          {_id: issue._id},
          { $set: issue },
          { returnNewDocument: true }
        )
          .then(result => {
            client.close();
            res.json(result.value);
          })
          .catch(err => console.log(err));
    });
  };
  
  this.deleteIssue = (project, id, mongo, res) => {
    mongo.connect(CONNECTION_STRING, (err, client) => {
        const db = client.db(process.env.DB_COLLECTION);
        db.collection(project)
          .remove({id: id})
          .then(result => {
            client.close();
            res.json({"success": "deleted " + id});
          })
          .catch(err => console.log(err));
    });
  }
  
}

module.exports = IssueHandler;