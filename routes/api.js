/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var IssueHandler = require('../controllers/IssueHandler.js');

module.exports = (app) => {  
    
        var issueHandler = new IssueHandler();
    
        app.route('/api/issues/:project')      
          .get(function (req, res){
            var project = req.params.project;
            var searchQuery = req.query;
          
            if(searchQuery.open == "true") searchQuery.open = true;
            if(searchQuery.open == "false") searchQuery.open = false;
          
            issueHandler.getAllProjectIssues(project, searchQuery, mongo, res);
        })

        .post(function (req, res){
          var project = req.params.project;
          var issueData = req.body;
          Object.keys(issueData).forEach((key) => (issueData[key] == null) && delete issueData[key]);
          if(issueData.issue_title && issueData.issue_text && issueData.created_by) {
             issueData.created_on = new Date();
             issueData.updated_on = new Date();
             issueData.open = true;
            
             issueHandler.addNewIssue(project, issueData, mongo, res);  
          } else {
            res.json("missing inputs");
          }
        })

        .put(function (req, res){
          var project = req.params.project;
          var issueData = {};        
          
          if(req.body._id || !req.body) {
            issueData._id = req.body._id;
            if(req.body.issue_title) issueData.issue_title = req.body.issue_title;
            if(req.body.issue_text) issueData.issue_text = req.body.issue_text;
            if(req.body.created_by) issueData.created_by = req.body.created_by;
            if(req.body.assigned_to) issueData.assigned_to = req.body.assigned_to;
            if(req.body.status_text) issueData.status_text = req.body.status_text;
            if(!req.body.open) issueData.open = false;
            issueData.updated_on = new Date();
            
            issueHandler.updateIssue(project, issueData, mongo, res);  
          } else {
            res.json("no updated field sent");
          }
          
        })

        .delete(function (req, res){
          var project = req.params.project;
          var issueData = req.query;
          if(!issueData._id) {
            res.json("please provide a valid id");
          } else {
            issueHandler.deleteIssue(project, issueData._id, mongo, res);  
          }
        });
};
