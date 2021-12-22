function GetFormattedDate(date) {
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + (date.getDate())).slice(-2);
    var year = date.getFullYear();
    var hour = ("0" + (date.getHours())).slice(-2);
    var min = ("0" + (date.getMinutes())).slice(-2);
    var seg = ("0" + (date.getSeconds())).slice(-2);
    return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + seg;
}

function showTask() {
    $.get('/api/task', (response) => {
        console.log(response);
        const records = $('#records > tbody');
        records.empty();
        for (let i = 0; i < response.length; i++) {
            let cell1 = `<td><input type="text" value="${response[i].description}"/></td>`;
            let cell2 = `<td><input type="datetime-local" value="${GetFormattedDate(new Date(response[i].time))}"/><input type="number" value="${response[i].id}" hidden/></td>`;
            let cell3 = `<td> <button type="button"  class="btn btn-warning btn-block update">Update</button></td>`;
            let cell4 = `<td> <button type="button"  class="btn btn-danger btn-block delete">Delete</button></td>`;
            let data = "<tr>" + cell1 + cell2 + cell3 + cell4 + "</tr>";
            records.append(data);
        }
        $('.update').click(function() {
            const description = $(this).parent().parent().find('input').eq(0).val();
            const time = $(this).parent().parent().find('input').eq(1).val();
            const id = $(this).parent().parent().find('input').eq(2).val();
            console.log(description, time, id);
            $.ajax({
                url: '/api/task/',
                type: 'PUT',
                data: { description, time, id },
                success: (response) => {
                    console.log(response);
                    showTask();
                }
            }).fail((err) => { console.log(err) });
        })

        $('.delete').click(function() {
            const id = $(this).parent().parent().find('input').eq(2).val();
            console.log(id);
            $.ajax({
                url: '/api/task/' + id,
                type: 'DELETE',
                success: (response) => {
                    console.log(response);
                    showTask();
                }
            }).fail((err) => { console.log(err) });
        })
    }).fail((err) => {
        console.log(err);
        alert(err.responseJSON.message);
        window.location = '/login.html';
    });
}

$(document).ready(function() {
    showTask();
    $('#add-task').click(function() {
        const description = $('#description').val();
        const time = $('#time').val();
        if (description == '' || time == '') {
            alert('Please fill all the fields');
        } else {
            $.post('/api/task', { description, time }, (response) => {
                console.log(response);
                showTask();
            }).fail((err) => { console.log(err) });
        }
    })

    $('#log-out').click(function() {
        console.log('logout');
        $.ajax({
            url: '/api/user/logout',
            type: 'POST',
            success: (response) => {
                console.log(response);
                window.location = '/login.html';
            }
        })

    })
})