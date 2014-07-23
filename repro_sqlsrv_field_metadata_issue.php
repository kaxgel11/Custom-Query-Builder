<?php

sqlsrv_configure( 'WarningsReturnAsErrors', false );

print_r( "calling connect", true );
$c = sqlsrv_connect( '(local)', array( 'Database' => 'master' ));
if( $c === false ) {
	die( print_r( sqlsrv_errors(), true ));
}

echo "Connected!\n";

$s = sqlsrv_query( $c, 'drop table [php_table_1_WREADHYPERV]');
$s = sqlsrv_query( $c, 'create table [php_table_1_WREADHYPERV] ([γεια σας κόσμο] [nvarchar](100) NOT NULL,
	[col2] [nvarchar](100) NOT NULL,
	[col3] [nvarchar](100) NOT NULL)');
if( $s === false ) {
	die( print_r( sqlsrv_errors(), true ));
}

$stmt = sqlsrv_query( $c, 'SELECT * FROM [php_table_1_WREADHYPERV]');
if( $stmt === false ) {
	die( print_r( sqlsrv_errors(), true ));
}
$ct = 1;
do 
{
	if ( sqlsrv_num_fields($stmt) > 0 )
	{
		$meta = sqlsrv_field_metadata($stmt);
		foreach ( $meta as &$col )
		{
			$col['BinaryName'] = '0x'.bin2hex($col['Name']);
		}
		echo "Result $ct Meta Data:\r\n".print_r($meta, true);
		
		$ctr=0;
		while ( ($row=sqlsrv_fetch_array($stmt)) )
		{
			++$ctr;
			echo "Result $ct Row {$ctr}:" . print_r($row, true);
		}
	}
	else
	{
		echo 'Result ' . $ct . " has no result set.\r\n";
	}
	
	++$ct;
} while ( ($rv = sqlsrv_next_result($stmt)) );

if ( $rv === false )
{
	echo 'Statement error (next result): ' . print_r(sqlsrv_errors(), true);
}
sqlsrv_free_stmt( $stmt );
sqlsrv_free_stmt( $s );

sqlsrv_close( $c );

?>
