<?php
require_once ROOT."/lib/file.php";
//the path to save project images, the path should be created before hand
$save_images = ROOT."/portfolio/projects/images/";
//the path to find the projects
$path = ROOT."/portfolio/project-mod/projects/";
//the path to save the json encoded projects details
$save_project = ROOT."/portfolio/projects/projects.json";

$pathIterator = new DirectoryIterator($path);
//this should be the directory structure of each folder in the project path :
// project
//    images---folder
//    link [optional]---file
//    description---file
//    start-date---file
//    end-date---file
//    name---file
// any folder that doesn't pass the following qualities will be skipped
// in the images folder only images will be selected and will be moved to the save images folder
//and there must be at least one image there,
//but note that there is no effort made to check if the image is a valid image

$image_folder = "images";
$link_file = "link.txt";
$description_file = "description.txt";
$start_date_file = "start.txt";
$end_date_file = "end.txt";
$name_file = "name.txt";

//the key to save each of the project details with
$images_key = "images"; $link_key = "link"; $description_key = "description"; 
$start_date_key = "startDate"; $end_date_key = "endDate"; $name_key = "name";

$projects = [];//the details for all the projects

foreach($pathIterator as $key=>$value){
    $filename = $value->getFilename();
    $pathInfo = $value->getPathInfo();
    $projectFolder = "$pathInfo/$filename";
    if(in_array($filename,File::virtual_files)){continue;}
    $link = File::get_contents("$projectFolder/$link_file","");
    $name = File::get_contents("$projectFolder/$name_file",null);
    $description = File::get_contents("$projectFolder/$description_file",null);
    $start_date = File::get_contents("$projectFolder/$start_date_file",null);
    $end_date = File::get_contents("$projectFolder/$end_date_file",null);
    if(!($description || $start_date || $end_date || $name)){continue;}
    $images = copy_images("$projectFolder/$image_folder/");
    if(!is_array($images)){continue;}
    $project = [
        $images_key=>$images,$link_key=>$link,$description_key=>$description,
        $start_date_key=>$start_date,$end_date_key=>$end_date,$name_key=>$name
    ];
    $projects[] = $project;
}
if(count($project) > 0){
    file_put_contents($save_project,json_encode($projects));
}

function copy_images($image_path){
    //moves the images in a folder to the "save_images"
    $images = [];
    if(!is_dir($image_path)){return false;}
    $path_iterator = new DirectoryIterator($image_path);
    global $save_images;
    foreach($path_iterator as $key=>$value){
        $filename = $value->getFilename(); $pathInfo = $value->getPathInfo();
        $full_path = "$pathInfo/$filename";
        if(in_array($filename,File::virtual_files)){continue;}
        if(is_file($full_path)){
            File::copy($full_path,$save_images,$filename); $images[] = $filename;
        }
    }
    return $images;
}
?>