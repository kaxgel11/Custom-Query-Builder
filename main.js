var app = angular.module('myApp', [ 'multi-select','ngGrid', 'nvd3ChartDirectives']);
app.controller('MyCtrl', function ($scope) {
    $scope.bo = [];
    $scope.filter = "mo";
    $scope.clientName = "";
    $scope.filterOptions = {
        filterText: ''
    };
    $scope.currentBOFilters = {};
    $scope.sc = [];
    $scope.filterOutputData = {};
    $scope.filterInputData = {};
    $scope.filterType = "";
    $scope.businesObjects = [
        {name: "clients"},
        {name: "offices"},
        {name: "loans"},
        {name: "savings"}
    ];
    $scope.searchFields = {};
    $scope.searchFieldValues = {};
    $scope.searchName = "";
    $scope.chartField = [];
    $scope.chartFields = [];
    $scope.chartTypes = [
        {name: "Pie Chart"},
        {name: "column chart"}
    ];
    $scope.chartType = [];
    $scope.pieCharts = [];
    $scope.currentBO;
    $scope.db = {
        clients: {
            tableName: "m_client",
            fields: [
                {name: "id", type: "number"},
                {name: "account_no", type: "string"},
                {name: "firstname", type: "string"},
                {name: "lastname", type: "string"},
                {name: "display_name", type: "string"},
                {name: "mobile_no", type: "string"}
            ],
            joins: {
                offices: {
                    table: "m_office",
                    idColumn: "office_id",
                    valueColumn: 'name',
                    joinedTableValueId: "id",
                    type:"text"
                },
                savings: {
                    table: "m_savings_account",
                    idColumn: "id",
                    valueColumn: "account_balance_derived",
                    joinedTableValueId: "client_id",
                    type:"number"
                }
            },
            filters: {
                filter: {query: "SELECT `m_office`.`id`, `m_office`.`name` FROM m_office", table: "m_office", column: "office_id"},
                filter2: {query: "SELECT `m_office`.`id`, `m_office`.`name` FROM m_office", table: "m_office", column: "office_id"}
            }
        },
        offices: {
            tableName: "m_office",
            fields: [
                {name: "id", type: "number"},
                {name: "external_id", type: "number"},
                {name: "name", type: "string"},
                {name: "opening_date", type: "date"}
            ]
        },
        loans: {
            tableName: "m_loan",
            fields: [
                {name: "account_no", type: "string"},
                {name: "currency_code", type: "string"},
                {name: "principal_amount", type: "number"},
                {name: "approved_principal", type: "number"},
                {name: "nominal_interest_rate_per_period", type: "number"},
                {name: "submittedon_date", type: "date"},
                {name: "approvedon_date", type: "date"},
                {name: "expected_disbursedon_date", type: "date"},
                {name: "expected_maturedon_date", type: "date"}
            ],
            joins: {
                client: {
                    table: "m_client",
                    idColumn: "client_id",
                    valueColumn: 'display_name',
                    joinedTableValueId: "id",
                    type:"text"
                },
                product: {
                    table: "m_product_loan",
                    idColumn: "product_id",
                    valueColumn: 'name',
                    joinedTableValueId: "id",
                    type:"text"
                },
                statuses: {
                    table: "r_enum_value",
                    idColumn: "loan_status_id",
                    valueColumn: 'enum_value',
                    joinedTableValueId: "enum_id",
                    type:"text"
                },
                officer: {
                    table: "m_staff",
                    idColumn: "loan_officer_id",
                    joinedTableValueId: "id",
                    valueColumn: "display_name",
                    type:"text"
                },
                savings: {
                    table: "m_savings_account",
                    idColumn: "client_id",
                    valueColumn: "account_balance_derived",
                    joinedTableValueId: "client_id",
                    type:"number"
                }
            },
            filters: {
                product: {query: "SELECT `m_product_loan`.`id`, `m_product_loan`.`name` FROM m_product_loan", table: "m_product_loan", column: "product_id"},
                client: {query: "SELECT `m_client`.`id`,`m_client`.`display_name` name FROM `m_client`", table: "m_client", column: "client_id"},
                statuses: {query: "SELECT `r_enum_value`.`enum_id` id,`r_enum_value`.`enum_value` name FROM `r_enum_value` where enum_name='loan_status_id'",
                    table: "r_enum_value", column: "loan_status_id"},
                officer: {query: "SELECT `m_staff`.`id`,`m_staff`.`display_name` name FROM `m_staff`", table: "m_staff", column: "loan_officer_id"}
            }
        },
        savings: {
            tableName: "m_savings_account",
            fields: [
                {name: "id", type: "number"},
                {name: "account_no", type: "string"},
                {name: "approvedon_date", type: "string"},
                {name: "currency_code", type: "string"},
                {name: "submittedon_date", type: "string"}
            ],
            joins: {
                client: {
                    table: "m_client",
                    idColumn: "client_id",
                    valueColumn: 'display_name'
                },
                product: {
                    table: "m_savings_product",
                    idColumn: "product_id",
                    valueColumn: 'name'
                },
                groups: {
                    table: "m_group",
                    idColumn: "group_id",
                    valueColumn: 'display_name'
                }
            },
            filters: {
                product: {query: "SELECT `m_savings_product`.`id`, `m_savings_product`.`name` FROM m_savings_product",
                    table: "m_savings_product", column: "product_id"},
                client: {query: "SELECT `m_client`.`id`,`m_client`.`display_name` name FROM `m_client`", table: "m_client", column: "client_id"}
            }}
    };
    $scope.typeMap = {
        "id": "number",
        "account_no": "text",
        "firstname": "text",
        "lastname": "text",
        "display_name": "text",
        "mobile_no": "text",
        "external_id": "text",
        "product_id": "number",
        "officer":"text",
        "name": 'text',
        "loan_officer_id": "text",
        "loan_status_id": "text",
        "currency_code": "text",
        "principal_amount": "number",
        "approved_principal": "number",
        "nominal_interest_rate_per_period": "number",
        "approvedon_date": "date",
        "submittedon_date": "date",
        "expected_disbursedon_date": "date",
        "expected_maturedon_date": "date",
        "savings":"number"
    };
    $scope.tableFields = [];
    $scope.searchInFields = [];
    $scope.selectedTables = [];
    $scope.$watch("bo", function () {
        if ($scope.bo[0]) {
            $scope.chartFields = [];
            $scope.currentBOFilters = {};
            $scope.tableFields = [];
            for (var key in $scope.db[$scope.bo[0].name].filters) {
                $scope.currentBOFilters[key] = $scope.db[$scope.bo[0].name].filters[key];
            }
            $scope.sql = null;
            $scope.sql = squel.select();
            $scope.sql.from($scope.db[$scope.bo[0].name].tableName);
            for (var i = 0; i < $scope.db[$scope.bo[0].name].fields.length; i++) {
                $scope.chartFields.push({name: $scope.db[$scope.bo[0].name].fields[i].name});
                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].fields[i].name + "`");
                if ($scope.db[$scope.bo[0].name].fields[i].name !== "id") {
                    $scope.tableFields.push({text: $scope.db[$scope.bo[0].name].fields[i].name,
                        name: "`"+$scope.db[$scope.bo[0].name].tableName+ "`.`" + $scope.db[$scope.bo[0].name].fields[i].name+ "`",
                        type: $scope.db[$scope.bo[0].name].fields[i].type});
                }
            }

            for (key in $scope.db[$scope.bo[0].name].joins) {
                $scope.tableFields.push({text: key, name: "`" + $scope.db[$scope.bo[0].name].joins[key].table
                    + "`.`" + $scope.db[$scope.bo[0].name].joins[key].valueColumn + "`",type:$scope.db[$scope.bo[0].name].joins[key].type})
                $scope.chartFields.push({name: key});
                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].joins[key].table + "`.`"
                    + $scope.db[$scope.bo[0].name].joins[key].valueColumn + "` " + key)
                    .join($scope.db[$scope.bo[0].name].joins[key].table, null,
                        "`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].joins[key].idColumn + "`=`" +
                        $scope.db[$scope.bo[0].name].joins[key].table + "`.`" + $scope.db[$scope.bo[0].name].joins[key].joinedTableValueId + "`");
            }
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            }
            $scope.tableFields.sort(dynamicSort("text"));


            console.log($scope.tableFields);
            $scope.filterType = "Filters";
            for (key in $scope.currentBOFilters) {
                $.ajax({
                    type: "GET",
                    url: "getdata.php?q=" + $scope.db[$scope.bo[0].name].filters[key].query,
                    async: false,
                    cache: false
                }).done(function (msg) {
                    $scope.filterInputData[key] = msg;
                })
            }
        }
    });
    $scope.selectBo=function(bo){
        if (bo) {
            $scope.currentBO=bo;
            $scope.chartFields = [];
            $scope.currentBOFilters = {};
            $scope.tableFields = [];
            for (var key in $scope.db[bo].filters) {
                $scope.currentBOFilters[key] = $scope.db[bo].filters[key];
            }
            $scope.sql = null;
            $scope.sql = squel.select();
            $scope.sql.from($scope.db[bo].tableName);
            for (var i = 0; i < $scope.db[bo].fields.length; i++) {
                $scope.chartFields.push({name: $scope.db[bo].fields[i].name});
                $scope.sql.field("`" + $scope.db[bo].tableName + "`.`" + $scope.db[bo].fields[i].name + "`");
                if ($scope.db[bo].fields[i].name !== "id") {
                    $scope.tableFields.push({text: $scope.db[bo].fields[i].name,
                        name: "`"+$scope.db[bo].tableName+ "`.`" + $scope.db[bo].fields[i].name+ "`",
                        type: $scope.db[bo].fields[i].type});
                }
            }

            for (key in $scope.db[bo].joins) {
                $scope.tableFields.push({text: key, name: "`" + $scope.db[bo].joins[key].table
                    + "`.`" + $scope.db[bo].joins[key].valueColumn + "`",type:$scope.db[bo].joins[key].type})
                $scope.chartFields.push({name: key});
                $scope.sql.field("`" + $scope.db[bo].joins[key].table + "`.`"
                    + $scope.db[bo].joins[key].valueColumn + "` " + key)
                    .join($scope.db[bo].joins[key].table, null,
                        "`" + $scope.db[bo].tableName + "`.`" + $scope.db[bo].joins[key].idColumn + "`=`" +
                        $scope.db[bo].joins[key].table + "`.`" + $scope.db[bo].joins[key].joinedTableValueId + "`");
            }
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            }
            $scope.tableFields.sort(dynamicSort("text"));


            console.log($scope.tableFields);
            $scope.filterType = "Filters";
            for (key in $scope.currentBOFilters) {
                $.ajax({
                    type: "GET",
                    url: "getdata.php?q=" + $scope.db[bo].filters[key].query,
                    async: false,
                    cache: false
                }).done(function (msg) {
                    $scope.filterInputData[key] = msg;
                })
            }
        }
    }
    $scope.$watch("searchInFields", function () {
        $scope.searchFields = {};
        for (var i = 0; i < $scope.searchInFields.length; i++) {

            $scope.searchFields[$scope.searchInFields[i].text] = {value: "",name:$scope.searchInFields[i].name, type: $scope.typeMap[$scope.searchInFields[i].text]}
        }

    });
    $scope.myData = [];

    $scope.loadData = function () {
        if ($scope.currentBO) {
            $scope.sql = null;
            $scope.sql = squel.select();
            $scope.sql.from($scope.db[$scope.currentBO].tableName);
            for (i = 0; i < $scope.db[$scope.currentBO].fields.length; i++) {
                $scope.sql.field("`" + $scope.db[$scope.currentBO].tableName + "`.`" + $scope.db[$scope.currentBO].fields[i].name + "`");
            }
            for (key in $scope.db[$scope.currentBO].joins) {
                $scope.sql.field("`" + $scope.db[$scope.currentBO].joins[key].table + "`.`"
                    + $scope.db[$scope.currentBO].joins[key].valueColumn + "` " + key)
                    .join($scope.db[$scope.currentBO].joins[key].table, null,
                        "`" + $scope.db[$scope.currentBO].tableName + "`.`" + $scope.db[$scope.currentBO].joins[key].idColumn + "`=`" +
                        $scope.db[$scope.currentBO].joins[key].table + "`.`" + $scope.db[$scope.currentBO].joins[key].joinedTableValueId + "`");
            }
            var inData = {};
            for (key in $scope.currentBOFilters) {
                inData[key] = [];
                for (i = 0; i < $scope.filterOutputData[key].length; i++) {
                    inData[key].push($scope.filterOutputData[key][i].id);
                }
            }
            console.log($scope.searchFields);
            if ($scope.searchInFields.length > 0) {
                var whereQuery = "(";
                for (var i = 0; i < $scope.searchInFields.length; i++) {
                    if ($scope.searchFields[$scope.searchInFields[i].text].value !== "") {

                        whereQuery += $scope.searchInFields[i].name;
                        if ($scope.typeMap[$scope.searchInFields[i].text] === "text") {
                            whereQuery += " ";
                            whereQuery += $scope.searchFields[$scope.searchInFields[i].text].operator;
                            whereQuery += " '";
                            if ($scope.searchFields[$scope.searchInFields[i].text].operator === "like")
                                whereQuery += "%";
                        } else if ($scope.typeMap[$scope.searchInFields[i].text] === "number") {
                            whereQuery += $scope.searchFields[$scope.searchInFields[i].text].operator;
                        } else if ($scope.typeMap[$scope.searchInFields[i].text] === "date") {
                            whereQuery += $scope.searchFields[$scope.searchInFields[i].text].operator;
                            whereQuery += "'";
                        }
                        if($scope.searchFields[$scope.searchInFields[i].text].value2){

                            whereQuery+=$scope.searchFields[$scope.searchInFields[i].text].value2;
                            whereQuery+=$scope.searchFields[$scope.searchInFields[i].text].operator2;
                        }
                        whereQuery += $scope.searchFields[$scope.searchInFields[i].text].value;
                        if($scope.searchFields[$scope.searchInFields[i].text].operator==="BETWEEN"){
                            if($scope.searchFields[$scope.searchInFields[i].text].type==="date")
                                whereQuery += "'";
                            whereQuery+=" and ";
                            if($scope.searchFields[$scope.searchInFields[i].text].type==="date")
                                whereQuery += "'";
                            whereQuery+=$scope.searchFields[$scope.searchInFields[i].text].value3;
                        }
                        if ($scope.typeMap[$scope.searchInFields[i].text] === "text") {
                            if ($scope.searchFields[$scope.searchInFields[i].text].operator === "like")
                                whereQuery += "%";
                            whereQuery += "'";
                        }

                        if ($scope.typeMap[$scope.searchInFields[i].text] === "date")
                            whereQuery += "'";
                        console.log(i,$scope.searchFields[$scope.searchInFields[i].text]);
                        if (i !== $scope.searchInFields.length - 1) {
                            whereQuery += " "+$scope.searchFields[$scope.searchInFields[i+1].text].andOr+" "
                        }
                    }
                }
                whereQuery += ")";
            } else {
                whereQuery = "";
            }
            if (whereQuery === "()") {
                whereQuery = "";
            }
            var inQuery = "";
            for (var key in inData) {
                if (inData[key].length > 0) {
                    inQuery += "`";
                    inQuery += $scope.db[$scope.currentBO].tableName;
                    inQuery += "`.`";
                    inQuery += $scope.db[$scope.currentBO].filters[key].column;
                    inQuery += "`";
                    inQuery += " in (";
                    for (i = 0; i < inData[key].length; i++) {
                        inQuery += inData[key][i];
                        if (i !== inData[key].length - 1) {
                            inQuery += ","
                        } else {
                            inQuery += ")"
                        }
                    }
                    inQuery += " and ";
                }
            }
            if (whereQuery === "") {
                inQuery = inQuery.substring(0, inQuery.length - 5);
            }
            if (inQuery + whereQuery !== "()") {
                $scope.sql.where(inQuery + whereQuery);
            }
            var q = $scope.sql.toString();
            console.log(q);
            $.getJSON("getdata.php?q=" + q, function (result) {
                $scope.myData = null;
                $scope.myData = result;
                console.log($scope.myData)
                $scope.$apply();
                $('#dataTable').dataTable();
            });

        }
    };
    $(document).ready(function(){
        $("#exportCsv").on("click",function(){
            console.log($scope.myData);
            JSONToCSVConvertor($scope.myData, $scope.currentBO+" Report", true);
        })
    })
    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    $scope.addChart = function () {
        if ($scope.chartType.length > 0 && $scope.myData.length > 0 && $scope.chartField.length > 0) {
            if ($scope.chartType[0].name === "Pie Chart") {
                var data = [];
                var obj = {};

                for (var i = 0; i < $scope.myData.length; i++) {
                    obj[$scope.myData[i][$scope.chartField[0].name]] = {value: 0};
                }
                for (i = 0; i < $scope.myData.length; i++) {
                    obj[$scope.myData[i][$scope.chartField[0].name]].value++;
                }
                for (var key in obj) {
                    data.push({key: key, y: parseInt(obj[key].value)})
                }
                $scope.pieCharts.push({
                    type: $scope.chartType[0].name,
                    field: $scope.chartField[0].name,
                    data: data,
                    tag: "nvd3-pie-chart"
                });
            }

        } else {
        }
    };
    $scope.pieChartX = function () {
        return function (d) {
            return d.key;
        };
    };
    $scope.pieChartY = function () {
        return function (d) {
            return d.y;
        };
    };
   /* $scope.gridOptions = { data: 'myData', showGroupPanel: true, enableCellSelection: true, enablePinning: true,
        enableColumnResize: true,
        selectWithCheckboxOnly: true, showFilter: true, showFooter: true, showSelectionCheckbox: true};*/
});
