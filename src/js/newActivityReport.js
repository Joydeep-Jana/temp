// TZ-506 Aishwarya added Report for New Activities
w3.includeHTML();
$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    $("#col2").on("change", "#formControlSelectPerson", generateLeads);
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForNewActivityReport");
        
		JSONToCSVConvertor(data, "ExcelDownloadForNewActivityReport", true);
	});
});

$(document).on("click", "#btnSubmit", function()
{
    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();
    var person = $("#formControlSelectPerson").val();
    var group  = $("#formControlSelectGroup").val();
    var leadId = $("#txtLeadId").val();
        /*+TZ-542 Aishwarya 07/08/2018 added alert box*/
    if(fromDate == "")
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "Please enter From Date",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
    }
    if(toDate == "")
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "Please enter To Date",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
    }
    if(toDate < fromDate)
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "From date should be before To date!",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
    }
    /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
    /*TZ-542 Aishwarya 07/08/2018 added base url */
    var url=TRAKKERZ_REPORTS_BASE_URL + "Reports/NewActivities";
    var params = ["FromDate", "ToDate", "PersonId", "GroupId","LeadId"];
    var values = [fromDate, toDate, person, group,leadId];
    
    var dataString = createJSON(params, values);
    
    ajaxCall(url, "POST", dataString, "application/json", newActivitySuccess);		
    
});
function newActivitySuccess(res)
{
    if(!!res.IsOk === true)
	{
		res = res.ResponseObject;
        var html = '';
        var excelDownload=[];
        
		for(var i = 0; i < res.length; ++i)
		{
			var activity = res[i].Activity;
			var activityCreationDate = res[i].ActivityCreationDate;
			var activityCreator = res[i].ActivityCreator;
			var amount = res[i].Amount;
			var clientVisit = res[i].ClientVisit;
			var collectionImage = res[i].CollectionImage;
            var leadId = res[i].LeadId;
            var leadName = res[i].LeadName;
            var method = res[i].Method;
            var spendStatus = res[i].SPENDStatus;
            var nextAppointmentDate = res[i].NextAppointmentDate;
            var purpose = res[i].Purpose;
            var referenceNumber= res[i].ReferenceNumber;
            var remarks = res[i].Remarks;
            if(collectionImage= "")
            collectionImage="True";
            else
            collectionImage="False";
            
            switch(spendStatus)
            {
                case 'S': 
                spendStatus="Suspecting";
                break;
                case 'P': 
                spendStatus="Prospecting";
                break;
                case 'E': 
                spendStatus="Expecting";
                break;
                case 'N': 
                spendStatus="Not Done";
                break;
                case 'D': 
                spendStatus="Done";
                break;
            }
            var innerDetails = {};
            innerDetails["School_Name"] = leadName;
            innerDetails["Activity"] = activity;
            innerDetails["Purpose"] = purpose;
            innerDetails["Activity_creator"] = activityCreator;
            innerDetails["Remarks"] = remarks;
            innerDetails["Next_appointment_date"] = nextAppointmentDate;
            innerDetails["Status"] = spendStatus;
            innerDetails["Activity_creation_date"] = activityCreationDate;

            excelDownload[excelDownload.length]=innerDetails;
            
            html += '<div>' +
            '<tr>' + 
            '<td>' + leadName + '</td>' + 
            '<td>' + activity + '</td>' +
            '<td>' + purpose + '</td>' + 
            '<td>' + activityCreator + '</td>' +
            '<td>' + remarks + '</td>' +
            '<td>' + nextAppointmentDate + '</td>' +
            '<td>' + spendStatus  + '</td>' + 
            '<td>' + activityCreationDate  + '</td>' + 
            '</tr>' +
            '</div>';
        }
        var tableData = '<table id="newActivityTableReport" class="table table-striped table-bordered table-responsive">'+
        '<thead>' +
        '<tr>' +   
        '<th>School Name</th>' +                  
        '<th>Activity</th>' +
        '<th>Purpose</th>' + 
        '<th>Activity Creator</th>' +
        '<th>Remarks</th>' +
        '<th>Next Appointment Date</th>' +
        '<th>Status</th>' + 
        '<th>Activity Creation Date</th>' + 
        '</tr>' +
        '</thead>' +
        '<tbody id="newActivityTableRows">' +
        '</tbody>' +
        '</table>';
        var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
		$("#downloadExcel").html(downloadButton);
        $(".newActivityForLead").html(tableData);
        $("#newActivityTableRows").html(html);
        $('#newActivityTableReport').DataTable(); 
        localStorage.setItem("ExcelDownloadForNewActivityReport",JSON.stringify(excelDownload));
	}
	else
	{
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
        $.confirm(
            {
                title: 'Alert!',
                content: "Sorry, No Records found.",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
            /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
		$("#newActivityTableRows").html("Sorry, No Records found.");	
	}
}
function gatherGroups()
{
    /*TZ-542 Aishwarya 07/08/2018 added base url */
    var url = TRAKKERZ_GROUPS_BASE_URL + "GetGroupsByOrganizationId";
    var dataString = {"OrganizationId":1};
    dataString = JSON.stringify(dataString);
    ajaxCall(url, "POST", dataString, "application/json", function(res)
    {
        var data = res.ResponseObject;
        html = "<option value=0 >Select Group</option>";
        for(var index=0; index<data.length; index++)
        {
            var name = data[index].GroupName;
            if(name.length>30)
            {
                name = name.substring(0, 30) + "...";
            }
            html += "<option value='" + data[index].GroupId + "'>" + name + "</option>";
        }
        $("#formControlSelectGroup").html(html);
    });
}

function groupChanged()
{
    if(this.value != "" && this.value != "Select Group")
    {
        /*TZ-542 Aishwarya 07/08/2018 added base url */
        var url = TRAKKERZ_GROUPS_BASE_URL + "GetMembersByGroupId";
        var dataString = "{'GroupId':" + this.value + "}";
        ajaxCall(url, "POST", dataString, "application/json", function(res){
            var data = res.ResponseObject;
            var html = "<option>Select Person</option>";
            for(var index=0; index<data.length; index++)
            {
                html += "<option value='" + data[index].PersonId + "'>" + data[index].FirstName + " " + data[index].LastName + "</option>";
            }
            $("#formControlSelectPerson").html(html);
        });
    }
    else
    {
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
        $.confirm(
            {
                title: 'Alert!',
                content: "Please Select a valid Group.",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
            /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
    }
}
function generateLeads()
{
    if(this.value != "" && this.value != "Select Group")
    {
        /*TZ-542 Aishwarya 07/08/2018 added base url */
        var url=TRAKKERZ_REPORTS_BASE_URL + "Reports/NewActivities";
        var fromDate = $("#txtFromDate").val();
        var toDate = $("#txtToDate").val();
        var person = this.value;
        var group  = $("#formControlSelectGroup").val();
        var params = ["FromDate", "ToDate", "PersonId", "GroupId"];
        var values = [fromDate, toDate, person, group];
        var dataString = createJSON(params, values);

        ajaxCall(url, "POST", dataString, "application/json", function(res)
        {
            console.log(dataString);
            var data = res.ResponseObject;
            var html = "<option>Select School</option>";
            for(var index=0; index<data.length; index++)
            {
                html += "<option value='" + data[index].LeadId + "'>" + data[index].LeadName + " </option>";
            }
            $("#formControlSelectSchool").html(html);
        });
    }
    else
    {
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
        $.confirm(
            {
                title: 'Alert!',
                content: "Please Select a valid Person.",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
            /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
    }
}