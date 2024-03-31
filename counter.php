<?php

if (file_exists("counter.log")) {
    $counter = file_get_contents("counter.log");
    $all = json_decode($counter);
    if (is_array($all))
	    $all[0]++;
    else    $all[] = 1;
    $output = json_encode($all);
    file_put_contents("counter.log", $output);
} else {
    $all[] = 1;
    file_put_contents("counter.log", json_encode($all));
}

echo $all[0];
