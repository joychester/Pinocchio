const ESclient = require('./es_connect');

//Function: check current status of your cluster
const checkNodeHealth = function() {
    ESclient.cluster.health({},function(err,resp,status) {
          console.log("-- Client Health --", resp);
      })
}

// Function: Create a new index and indexing(stroing documents in an index)
const createIndx = function(idx_name) {
    ESclient.indices.create({
        index: idx_name
    }, function(err, resp, status) {
        if(err) {
            console.log(err);
        } else {
            console.log("create ", resp)
        }
    });
}

// Function: Delete a index
const deleteIndx = function(idx_name) {
    ESclient.indices.delete({
        index: idx_name
    }, function(err, resp, status) {
        if(err) {
            console.log(err);
        } else {
            console.log("deleted ", resp)
        }

    });
}

// Function: Insert a Document to index
const insertDoc = function(idx_name, doc_body, type_name) {
    ESclient.index({
        index: idx_name,
        //id: '1',  //id will be generated automatically if not specify
        type: type_name, //a class of similar documents
        body: doc_body
    }, function(err, resp, status){
        console.log(`Doc Insert Status Code: ${resp.statusCode}`);
    });
}

// Function: Delete a document
const deleteDocById = function(idx_name, doc_id, type_name) {
    ESclient.delete({
        index: idx_name,
        id: doc_id,
        type: type_name
    }, function(err, resp, status) {
        console.log(resp);
    });
}

// Function: Bulk Insert Documents
const bulkInsertDoc = function(idx_name, bulk_body, type_name) {
    ESclient.bulk({
        index: idx_name,
        type: type_name,
        body: bulk_body
        }, function(err, resp, status) {
            if(err) {
                console.log(err);
            } else {
                console.log(resp);
            }
        });
}

// Function: Search document by query object
const queryDoc = function(idx_name, query_obj, type_name) {
  ESclient.search({
    index: idx_name,
    type: type_name,
    body: {
      query: query_obj,
    }
  }).then(function(resp) {
    resp.body.hits.hits.forEach(function(hit) {
      console.log(hit._source);
    });
  }, function(err) {
    console.trace(err.message);
  });
}

module.exports = {
  checkNodeHealth: checkNodeHealth,
  createIndx: createIndx,
  deleteIndx: deleteIndx,
  insertDoc: insertDoc,
  deleteDocById: deleteDocById,
  bulkInsertDoc: bulkInsertDoc,
  queryDoc: queryDoc
}
