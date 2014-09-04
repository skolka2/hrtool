(function() {
  var ComponentBase, ComponentTaskList,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentTaskList = (function(_super) {
    __extends(ComponentTaskList, _super);

    function ComponentTaskList(taskDetailSelection) {
      this.taskDetailSelection = taskDetailSelection;
      ComponentTaskList.__super__.constructor.call(this);
      this.data = [];
      return;
    }

    ComponentTaskList.prototype.onLoad = function(data) {
      if (data.length > 0) {
        this.data = data;
        this.addTasks();
      } else {
        this.clearContent();
        this.setNoTasks();
      }
    };

    ComponentTaskList.prototype.addTasks = function() {
      var task, taskData, taskDataModified, _i, _len, _ref;
      this.clearContent();
      _ref = this.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        taskData = _ref[_i];
        taskDataModified = {
          taskId: taskData.id_task,
          taskOwner: taskData.user_email,
          taskBuddy: taskData.buddy_email,
          taskTitle: taskData.title,
          dateFrom: taskData.date_from,
          dateTo: taskData.date_to,
          taskDescription: taskData.description,
          taskNotes: taskData.notes,
          isFinished: taskData.completed
        };
        task = this.taskDetailSelection(taskDataModified);
        if (this.rendered) {
          task.render(this.content);
        }
        this.addChild("task" + taskDataModified.taskId, task, {
          'el': this.content
        });
      }
    };

    ComponentTaskList.prototype.createDom = function() {
      this.content = document.createElement('div');
      this.content.className = "task-list-content";
      this.element = this.content;
    };

    ComponentTaskList.prototype.clearContent = function() {
      var name;
      for (name in this.childs) {
        this.childs[name].component.destroy();
        this.removeChild(name);
      }
      this.content.innerHTML = '';
    };

    ComponentTaskList.prototype.setNoTasks = function() {
      var infoText;
      infoText = document.createElement('h3');
      infoText.innerText = 'No tasks to be displayed...';
      this.content.appendChild(infoText);
    };

    return ComponentTaskList;

  })(ComponentBase);

  ComponentTaskList.EventType = {
    buddy: {
      DATA_LOAD_COMPLETED: 'tasks/buddy/list/completed',
      DATA_LOAD_NOT_COMPLETED: 'tasks/buddy/list/not-completed'
    },
    user: {
      DATA_LOAD_COMPLETED: 'tasks/user/list/completed',
      DATA_LOAD_NOT_COMPLETED: 'tasks/user/list/not-completed'
    },
    manager: {
      DATA_LOAD_COMPLETED: 'tasks/teams/list/completed',
      DATA_LOAD_NOT_COMPLETED: 'tasks/teams/list/not-completed'
    }
  };

  module.exports = ComponentTaskList;

}).call(this);
