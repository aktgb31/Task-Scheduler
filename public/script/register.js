$(document).ready(function() {
    $('#submit-button').click(function() {
        const userName = $('#userName').val();
        const password = $('#password').val();
        if (userName == '' || password == '') {
            alert('Please fill all the fields');
        } else {
            $.post('/api/user/register', { userName, password }, () => {
                alert('Registered Successfully');
                window.location = '/login.html';
            }).fail((err) => { alert(err.responseJSON.message) });
        }
    })
})