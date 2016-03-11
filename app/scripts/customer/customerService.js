(function () {
    'use strict';
    // Type 3: Persistent datastore with automatic loading
    var Datastore = require('nedb')
        , db = new Datastore({ filename: 'app/database', autoload: true });
    
    angular.module('app')
        .service('customerService', ['$q', CustomerService]);
    
    function CustomerService($q) {
        return {
            getCustomers: getCustomers,
            getById: getCustomerById,
            getByName: getCustomerByName,
            create: createCustomer,
            destroy: deleteCustomer,
            update: updateCustomer
        };
        
        function getCustomers() {
            var deferred = $q.defer();
            
            db.find({}).sort({ name: 1 }).exec(function (err, docs) {
                if (err) deferred.reject(err);
                deferred.resolve(docs);
            });
            return deferred.promise;
        }
        
        function getCustomerById(id) {
            var deferred = $q.defer();
            
            db.findOne({ _id: id }, function (err, doc) {
                if (err) deferred.reject(err);
                deferred.resolve(doc);
            });
            
            return deferred.promise;
        }
        
        function getCustomerByName(name) {
            var deferred = $q.defer();
            
            db.find({"name": name}, function (err, docs) {
                if (err) deferred.reject(err);
                deferred.resolve(docs);
            });
            return deferred.promise;
        }
        
        function createCustomer(customer) {
            var deferred = $q.defer();
            
            db.insert(customer, function (err, newDoc) {   // Callback is optional
                console.log(err)
                if (err) deferred.reject(err);
                console.log(newDoc)
                deferred.resolve(newDoc._id);
            });
            
            return deferred.promise;
        }
        
        function deleteCustomer(id) {
            var deferred = $q.defer();
            
            db.remove({ _id: id }, {}, function (err, numRemoved) {
                if (err) deferred.reject(err);
                console.log(numRemoved);
                deferred.resolve(numRemoved);
            });
            return deferred.promise;
        }
        
        function updateCustomer(customer) {
            var deferred = $q.defer();
            var newObj = { 
                name: customer.name, 
                email: customer.email,
                address: customer.address,
                city: customer.city,
                phone: customer.phone
            };
            
            db.update({ _id: customer._id }, newObj, {}, function (err, numReplaced) {
                console.log(err);
                if (err) deferred.reject(err);
                deferred.resolve(numReplaced);
            });            
            return deferred.promise;
        }
    }
})();