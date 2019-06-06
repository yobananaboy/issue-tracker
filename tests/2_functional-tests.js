/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
chai.config.includeStack = true; 

suite('Functional Tests', function() {
  
    var delId;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title', "title");
          assert.equal(res.body.issue_text, 'text', "issue text");
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in', "created by");
          assert.equal(res.body.assigned_to, 'Chai and Mocha', "assigned to");
          assert.equal(res.body.status_text, 'In QA', "status text");
          assert.equal(res.body.open, true, "open");
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
         
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title required',
            issue_text: 'Text is required',
            created_by: 'Created by is required'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Title required', "title");
            assert.equal(res.body.issue_text, 'Text is required', "issue text");
            assert.equal(res.body.created_by, 'Created by is required', "created by");
            assert.equal(res.body.open, true, "open");
            assert.property(res.body, 'updated_on', "updated on");
            assert.property(res.body, 'created_by', "created by");
            assert.equal(res.body.status_text, null);
            assert.equal(res.body.assigned_to, null);
            delId = res.body._id;
          
            done();
          })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title is required but not included other required fields'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing inputs");
            
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no updated field sent");
          
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
              _id: "5cf5071305a433b87fae2a6d",
              assigned_to: 'Test'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200)  
            assert.equal(res.body._id, "5cf5071305a433b87fae2a6d")
            assert.equal(res.body.assigned_to, "Test")
          
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: "5cf5071305a433b87fae2a7e",
            issue_title: "Test multiple fields",
            issue_text: "This is a test",
            created_by: "Bob",
            assigned_to: "Somebody",
            open: false
          })
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body._id, "5cf5071305a433b87fae2a7e");
            assert.equal(res.body.issue_title, "Test multiple fields");
            assert.equal(res.body.issue_text, "This is a test");
            assert.equal(res.body.created_by, "Bob");
            assert.equal(res.body.assigned_to, "Somebody");
            assert.equal(res.body.open, false);
          
            done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            open: "true"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.length, 2);
            assert.equal(res.body[0].issue_title, "Title");
            assert.equal(res.body[0].assigned_to, "Chai and Mocha");
            assert.equal(res.body[1].issue_title, "Title required");
            assert.equal(res.body[1].created_by, "Created by is required");
          
            done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            open: true,
            issue_title: "Title"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.length, 1);
            assert.equal(res.body[0].issue_title, "Title");
            assert.equal(res.body[0].assigned_to, "Chai and Mocha");
          
            done();
          })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "please provide a valid id");
          
            done();
          })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .query({
            _id: delId
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.success, "deleted " + delId);
          
            done();
          })
      });
      
    });

});
