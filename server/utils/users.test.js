var expect = require('expect');
var {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Albert',
      room: 'Falcon Room'
    }, {
      id: '2',
      name: 'Ben',
      room: 'Indigo Room'
    },{
      id: '3',
      name: 'Casey',
      room: 'Falcon Room'
    }];
  })

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: "1234",
      name: "John",
      room: "House of Dead"
    }

    var res = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove user', () => {
    var userId = '1';
    var user = users.removeUser(userId);
    expect(user.id).toEqual(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var userId = '99';
    var user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should get user', () => {
    var userId = '2';
    var user = users.getUser(userId);
    expect(user.id).toEqual(userId);
  });

  it('should not get user', () => {
    var userId = '99';
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should return user lists in Falcon Room', () => {
    var userList = users.getUserList('Falcon Room');
    expect(userList).toEqual(['Albert', 'Casey']);
  });

  it('should return user lists in Indigo Room', () => {
    var userList = users.getUserList('Indigo Room');
    expect(userList).toEqual(['Ben']);
  });
});
