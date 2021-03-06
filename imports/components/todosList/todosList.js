import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import {Tasks} from '../../api/tasks.js';
import { Meteor } from 'meteor/meteor';


class TodosListCtrl {

    constructor($scope) {
        //called at init
        $scope.viewModel(this);

        this.subscribe('tasks');

        this.helpers({
            tasks() {
                return Tasks.find({}, {
                    sort: {
                        createdAt: -1
                    }
                })
            },
            currentUser() {
                return Meteor.user();
            }
        })
    }

    /**
     * Send new task to add method and check input error / display error // success message
     * @param newTask
     */
    submit_task(newTask) {
        this.error = false;
        this.error_message = "";
        this.success_message = "";
        if (!newTask) {
            // undefined input
            this.error = true;
            this.error_message = "Task is undefined"
        } else {
            if (newTask.length === 0) {
                // empty input
                this.error = true;
                this.error_message = "Task is empty !";
            } else {
                // INSERT
                let taskToAdd = {
                    text: newTask,
                    createdAt: new Date,
                    owner: Meteor.userId(),
                    username: Meteor.user().username
                };
                this.add_task(taskToAdd);
                this.newTask = ""; // reset task field to ""
                this.error = false; // reset error
                this.error_message = ""; // reset error message
                this.success_message = "Added with success.";
            }
        }
    }

    /**
     * Add new task to DB
     * @param newTask
     * @returns {*|{allow, deny}|boolean}
     */
    add_task(newTask) {
        return Tasks.insert(newTask);
    }

    /**
     * Delete tasks
     * @param task_id (ObjectID)
     */
    delete_task(task_id) {
        Tasks
            .remove({'_id': task_id});
        if (this.tasks.length === 0) {
            this.success_message = "You deleted all your tasks";
        } else {
            this.success_message = "Deleted with success.";
        }
    };

    /**
     * Open edit field for title task
     * @param task_id (ObjectID);
     */
    edit_task(task_id) {
        this.task_to_change = task_id;
        console.log("EDIT ? : ", task_id);
    }

    /**
     * Apply value from text field into text field Task model
     * @param task_id
     * @param taskNewTitle
     */
    edit_apply(task_id, taskNewTitle) {
        Tasks
            .update({
                '_id': task_id
            }, {
                $set: {text: taskNewTitle},
            });


        this.task_to_change = ""; // reset input clicked (close input edit)
    }


    /**
     * Using Meteor.methods object in api (remove all not allowed from client)
     */
    delete_all() {
        Meteor.call('tasks.removeAll');
    }


}

export default angular.module('todosList', [
    angularMeteor
])
    .component('todosList', {
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: ['$scope', TodosListCtrl]
    });