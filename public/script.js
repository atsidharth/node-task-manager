const app = angular.module('tapp',[])

app.controller('tapp-controller',($scope)=>{
   $scope.apiList = [{
       op: 'Creating user',
       mtd: 'POST',
       url: '/users',
       body: '{"name" :__, "age":__, "email":__, "password":__ }',
       desc: '(Successfull user creation will return user details with "token" for further opertaion)' 
   },{
    op: 'Avatar upload',
    mtd: 'POST',
    url: '/users/me/avatar',
    body: 'image file'
},{
    op: 'User Login',
    mtd: 'POST',
    url: '/users/login',
    body: '{"email":__, "password":__}',
    desc: '(Successfull user login  will return user details with "token" for further opertaion)'
},{
    op: 'Logout user',
    mtd: 'POST',
    url: '/users/logout'    
},{
    op: 'Logout all sessions',
    mtd: 'POST',
    url: '/users/logoutAll'
},{
    op: 'Get profile details',
    mtd: 'GET',
    url: '/users/me'
},{
    op: 'Updating user details',
    mtd: 'PATCH',
    url: '/users/me',
    body: '{"name":__, "email":__, "password":__}'
},{
    op: 'Delete user',
    mtd: 'DELETE',
    url: '/users/me'
},{
    op: 'Create task',
    mtd: 'POST',
    url: '/tasks',
    body: '{"description":__, "completed":__}'
},{
    op: 'Read all tasks of logged in user',
    mtd: 'GET',
    url: '/tasks?(completed=true/false, limit=int, skip=int ,sortBy=createdAt:asc/desc)'
},{
    op: 'Read a particular task',
    mtd: 'GET',
    url: '/tasks/(task_id)'
},{
    op: 'Update task',
    mtd: 'PATCH',
    url: '/tasks/(task_id)'
},{
    op: 'Delete task',
    mtd: 'DELETE',
    url: '/tasks/(task_id)'
},{
    op: 'Delete user avatar ',
    mtd: 'DELETE',
    url: '/users/me/avatar'
},{
    op: 'Get avatar of a particular user',
    mtd: 'GET',
    url: '/users/(user_id)/avatar'
}            
]
})