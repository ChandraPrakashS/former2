/* ========================================================================== */
// WorkSpaces
/* ========================================================================== */

sections.push({
    'category': 'End User Computing',
    'service': 'WorkSpaces',
    'resourcetypes': {
        'Workspaces': {
            'columns': [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        formatter: primaryFieldFormatter,
                        footerFormatter: textFormatter
                    },
                    {
                        title: 'Properties',
                        colspan: 4,
                        align: 'center'
                    }
                ],
                [
                    {
                        field: 'directoryid',
                        title: 'Directory ID',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    },
                    {
                        field: 'username',
                        title: 'Username',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    },
                    {
                        field: 'ipaddress',
                        title: 'IP Address',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    },
                    {
                        field: 'subnetid',
                        title: 'Subnet ID',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    }
                ]
            ]
        }
    }
});

async function updateDatatableEndUserComputingWorkSpaces() {
    blockUI('#section-endusercomputing-workspaces-workspaces-datatable');

    await sdkcall("WorkSpaces", "describeWorkspaces", {
        // no params
    }, true).then((data) => {
        $('#section-endusercomputing-workspaces-workspaces-datatable').bootstrapTable('removeAll');

        data.Workspaces.forEach(workspace => {
            $('#section-endusercomputing-workspaces-workspaces-datatable').deferredBootstrapTable('append', [{
                f2id: workspace.WorkspaceId,
                f2type: 'workspaces.workspace',
                f2data: workspace,
                f2region: region,
                id: workspace.WorkspaceId,
                directoryid: workspace.DirectoryId,
                username: workspace.UserName,
                ipaddress: workspace.IpAddress,
                subnetid: workspace.SubnetId
            }]);
        });

        unblockUI('#section-endusercomputing-workspaces-workspaces-datatable');
    });
}

service_mapping_functions.push(function(reqParams, obj, tracked_resources){
    if (obj.type == "workspaces.workspace") {
        reqParams.cfn['DirectoryId'] = obj.data.DirectoryId;
        reqParams.cfn['UserName'] = obj.data.UserName;
        reqParams.cfn['BundleId'] = obj.data.BundleId;
        reqParams.cfn['VolumeEncryptionKey'] = obj.data.VolumeEncryptionKey;
        reqParams.cfn['UserVolumeEncryptionEnabled'] = obj.data.UserVolumeEncryptionEnabled;
        reqParams.cfn['RootVolumeEncryptionEnabled'] = obj.data.RootVolumeEncryptionEnabled;
        reqParams.cfn['WorkspaceProperties'] = obj.data.WorkspaceProperties;

        /*
        TODO:
        Tags:
            - Tag
        */

        tracked_resources.push({
            'obj': obj,
            'logicalId': getResourceName('workspaces', obj.id, 'AWS::WorkSpaces::Workspace'),
            'region': obj.region,
            'service': 'workspaces',
            'type': 'AWS::WorkSpaces::Workspace',
            'options': reqParams
        });
    } else {
        return false;
    }

    return true;
});
