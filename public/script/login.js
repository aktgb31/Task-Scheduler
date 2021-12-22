$(document).ready(function() {
    $('#submit-button').click(function() {
        const userName = $('#userName').val();
        const password = $('#password').val();
        if (userName == '' || password == '') {
            alert('Please fill all the fields');
        } else {
            $.post('/api/user/login', { userName, password }, () => {
                alert('Logged in Successfully');
                window.location = '/';
            }).fail((err) => { alert(err.responseJSON.message) });
        }
    })
})