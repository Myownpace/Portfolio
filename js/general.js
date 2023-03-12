window.onload = function(){
    var windowLoaded = Number(new Date())
    var timeSinceLogo = windowLoaded - logoStart
    var bigScreen = 700 //the minimum width that is considered a split screen
    var screenThreshold = 900 // the min screen for split screen for the projects section

    var main = document.getElementById("main")
    var menu = document.getElementById("menu")
    var indexBtn = document.getElementById("index-btn")
    var indexUI = document.getElementById("index-wrapper")
    var intro = document.getElementById("introduction")
    var philo = document.getElementById("philosophy")
    var introWrapper = intro.children[0]
    var skillsBtn = document.getElementById("skills-btn")
    var skillsTab = document.getElementById("skills")
    var skillsTabOpen = false
    var skillsUI = new options(skillsBtn,undefined,genSkillsUI,false)
    var contactBtn = document.getElementById("contact-btn")
    var contactBtn2 = document.getElementById("contact-btn-2")
    var contactUI
    var contactTab = new options(contactBtn,[contactBtn2],genContactUI,false)
    var projectsBtn = document.getElementById("projects-btn")
    var projectsUI
    var projectReq
    var projectsTab
    var parsedProjects
    var viewControl
    var projectsListView,projectsGridView,viewProject,selectedView,tabWrapper,viewProjectSmallScreen,viewProjectOpen,
    selectedViewWindow;

    var projectsImages = "projects/images/"
    var projectsData = "projects/projects.json"

    var sectionFunctions = {projectInterface:projectInterface}
    var currentSection
    var currentSectionWindow = indexUI
    var projectViewOptions
    function indicateSection(sectionButton){
        //indicates which section of the web site a user is on
        //if the sectionButton is indicated then the it's section is taken as the current section
        var menuItems = menu.children
        for(var i=0; i < menuItems.length; i++){
            var item = menuItems[i];  
            if(equalString(item.className,"clear-fix")){continue}
            var itemLink = item.children[0].href
            if((!sectionButton && isSameUrl(location.href,itemLink,"index.html")) || (item == sectionButton)){
                changeClass(item,"","currentLink"); currentSection = item
                if(!sectionButton){break}
            }
            else{changeClass(item,"currentLink","")}
        }
    }
    function getMainHeight(){
        var menuHeight = elementDim(menu,"h")
        var windowH = windowDim("h")
        return windowH - menuHeight
    }
    function adjust(){
        //adjusts the page
        var menuHeight = elementDim(menu,"h")
        var dim = windowDim(); var dimH = dim.h; var dimW = dim.w
        var mainHeight = dimH - menuHeight
        
        //adjust the main section
        main.style.marginTop = menuHeight.toString() + "px"

        if(currentSection === indexBtn){
            //adjust the intro section to always cover the full height
            if(dim.w >= bigScreen){
                intro.style.width = "60%"; philo.style.width = "35%"; philo.style.marginLeft = "5%"
                intro.style.float = "left"; philo.style.float = "left"
                var philoDim = elementDim(philo)
                philo.style.marginTop = ((mainHeight - philoDim.h)/2).toString() + "px"
            }
            else{intro.style.width = ""; philo.style.width = ""; philo.style.marginLeft = ""
                intro.style.float = ""; philo.style.float = ""; philo.style.marginTop = ""
            }
           intro.style.minHeight = mainHeight.toString() + "px"
           var wrapperHeight = elementDim(introWrapper,"h")
            if(mainHeight > wrapperHeight){
                introWrapper.style.marginTop = ((mainHeight - wrapperHeight)/2).toString() + "px"
            }
        }
        if(currentSection === projectsBtn){
            projectsUI.style.minHeight = mainHeight.toString() + "px"
            if(dimW >= screenThreshold){
                projectsUI.id = "projects-ui-big-screen";
            }
            else{
                projectsUI.id = "projects-ui"; 
            }
        }
    }
    function startups(){
        changeClass(document.body,"","loaded")
        var sectionIni =  getSection()
        remove(curtain); window.onresize = null
        main.style.display="block"; menu.style.display="block"; 
        if(isFunction(sectionIni)){sectionIni()}
        else{indicateSection();}
        adjust();
        addEvent(window,"resize",adjust)
    }
    function genContactUI(){
        //for initiating the contact me page
        var tab = contactTab.optionElement
        if(!contactUI){
            contactUI = document.createElement("div");
            contactUI.className = "black-all minor-pad"
            var heading = document.createElement("h1"); heading.innerHTML = "Contact Me";
            heading.style.marginTop = "0px"
            var headsup = document.createElement("div"); headsup.className = "space-up minor-pad"
            headsup.innerHTML = "You can contact Me through any of the following mediums"
            var forums = document.createElement("div"); forums.className = "minor-pad"
            var forumsArray = [
                {icon:"phone.png",name:"+2349166102474",onclick:copyPhone},
                {icon:"whatsapp.png",name:"Whatsapp",onclick:wa},
                {icon:"upwork.png",name:"Upwork",onclick:uw},
                {icon:"email.png",name:"Chigoziemchidiebube@gmail.com",onclick:copyEmail}
            ]
            genForums()
            append(contactUI,[heading,headsup,forums])
            tab.appendChild(contactUI)
        }
        function genForums(){
            for(var i=0; i < forumsArray.length; i++){
                var forum = document.createElement("div"); forum.className = "flex vcenter pointer"
                if(i > 0){forum.style.marginTop = "4%"}
                var forumDetails = forumsArray[i]
                var forumIcon = document.createElement("img"); forumIcon.className = "icon"
                forumIcon.src = "img/" + forumDetails.icon
                var forumName = document.createElement("span"); forumName.className = "space-left small-text"
                forumName.innerHTML = forumDetails.name
                set(forum,forumDetails)
                append(forum,[forumIcon,forumName])
                forums.appendChild(forum)
            }
            function set(forum,forumDetails){
                if(isFunction(forumDetails.onclick)){
                    forum.onclick = function(){forumDetails.onclick(forumDetails)}
                }
            }
        }
        function copyPhone(details){
            copy(details.name)
        }
        function wa(details){
            window.open("https://wa.link/ftapf2","_blank")
        }
        function uw(){
            window.open("https://www.upwork.com/freelancers/~012c4e9f7c5bc428d3","_blank")
        }
        function copyEmail(details){
            copy(details.name)
        }
    }
    function genSkillsUI(){
        if(!skillsTabOpen){
            changeClass(skillsTab,"none","")
            skillsUI.optionElement.appendChild(skillsTab); skillsTabOpen = true
        }
    }
    function projectInterface(){
        indicateSection(projectsBtn); setSection("projectInterface")
        if(!projectsUI){
            projectsUI = document.createElement("div"); projectsUI.className = "flex vcenter hcenter";
        }
        remove(currentSectionWindow)
        main.appendChild(projectsUI); adjust()
        currentSectionWindow = projectsUI
        if(!projectReq){
            projectReq = new Req(projectsData,"GET")
            projectReq.loadElement = projectsUI
            projectReq.loadClass = progress
            projectReq.onload = function(req){
                projectsUI.className = "space-up relative loaded";
                parsedProjects = JSON.parse(req.object.responseText)
                var heading = document.createElement("h1"); 
                heading.innerHTML = "Past projects"
                
                var sectionHeadsup = document.createElement("div"); sectionHeadsup.className = "minor-pad"
                sectionHeadsup.innerHTML = "Here you can see my past work For clients, You can also find links to the  \
websites that i have been permitted to share"
                var viewHeadsup = document.createElement("label"); viewHeadsup.className = "space-up"
                viewHeadsup.innerHTML = "Layout Options"
                viewControl = document.createElement("div"); viewControl.id = "view-control"
                viewControl.className = "flex vcenter minor-gap"
                projectViewOptions = viewOptions(
                    viewControl,
                    [{icon:"img/list-view.png",gen:listView,name:"List view"},
                    {icon:"img/grid-view.png",gen:gridView,name:"Grid view"}
                    ]
                )

                tabWrapper = document.createElement("div"); tabWrapper.id = "project-tab-wrapper"
                projectsTab = document.createElement("div"); projectsTab.className = "my-shadow";
                projectsTab.id = "project-tab"
                append(tabWrapper,[sectionHeadsup,viewHeadsup,viewControl,projectsTab])

                listView()
                append(projectsUI,[heading,tabWrapper])
                adjust()
            }
            projectReq.send()
        }
        function viewOptions(viewControl,options){
            var viewBtns = {}
            for(var i=0; i < options.length; i++){
                eachView(options[i])
            }
            function eachView(details){
                var container = document.createElement("div"); container.className = "minor-pad pointer"
                container.onclick = details.gen; container.title = details.name
                if(details.gen){viewBtns[details.gen] = container}
                var icon = document.createElement("img"); icon.className = "icon"; icon.src =  details.icon
                container.appendChild(icon)
                viewControl.appendChild(container)
            }
            return viewBtns
        }
        function listView(){
            //the list view display of projects
            if(!projectsListView){
                projectsListView = document.createElement("div")
                projectsListView.id = "project-list-view"
                var numProjects = parsedProjects.length
                for(var i=0; i < numProjects;  i++){
                    eachProject(parsedProjects[i],i)
                }
            }
            function eachProject(details,index){
                var container = document.createElement("div"); container.setAttribute("data-key",index)
                container.onclick = openProject
                container.className = "flex vcenter minor-gap minor-pad pointer list-item"
                var coverImage = document.createElement("img"); coverImage.src = projectsImages + details.images[0]
                var name = document.createElement("div"); name.innerHTML = details.name; 
                name.className = "project-name medium-text oneline ellipsis"
                append(container,[coverImage,name])
                projectsListView.appendChild(container)
            }
            if(selectedViewWindow){remove(selectedViewWindow)}
            projectsTab.appendChild(projectsListView)
            indicateSelectedView(projectViewOptions[listView])
            selectedViewWindow = projectsListView
        }
        function gridView(){
            if(!projectsGridView){
                projectsGridView = document.createElement("div");
                projectsGridView.id = "project-grid-view"
                var numProjects = parsedProjects.length
                for(var i=0; i < numProjects; i++){
                    eachProject(parsedProjects[i],i)
                }
                var clearFix = document.createElement("div"); clearFix.className = "clear-fix"
                projectsGridView.appendChild(clearFix)
            }
            function eachProject(details,index){
                var container = document.createElement("div"); container.setAttribute("data-key",index);
                container.onclick = openProject
                container.className = "float-left item pointer zoom"
                var coverImage = document.createElement("img"); coverImage.src = projectsImages + details.images[0]
                var name = document.createElement("div"); name.innerHTML = details.name
                name.className = "name medium-text oneline ellipsis"
                append(container,[coverImage,name])
                projectsGridView.appendChild(container)
            }
            remove(selectedViewWindow)
            projectsTab.appendChild(projectsGridView)
            indicateSelectedView(projectViewOptions[gridView])
            selectedViewWindow = projectsGridView
        }
        function openProject(){
            if(!viewProject){
                viewProject = document.createElement("div"); viewProject.id = "view-project"
            }
            viewProject.innerHTML = ""
            var data = parsedProjects[this.getAttribute("data-key")]
            var imageSlider
            viewProjectOpen = true
            var projectTitle = document.createElement("h1"); projectTitle.innerHTML = data.name
            var projectDesc = document.createElement("div"); projectDesc.className = "space-up minor-pad"
            projectDesc.innerHTML = data.description
            viewProject.appendChild(projectTitle)
            images()
            adjust()
            imageSlider.display()
            viewProject.appendChild(projectDesc)
            if(data.link){
                var link = document.createElement("a"); link.href = data.link; link.target = "_blank"
                link.innerHTML = "See project"; link.className = "minor-pad space-up link"
                viewProject.appendChild(link)
            }
            addEvent(window,"resize",adjust)
            function images(){
                imageSlider = new slider(viewProject)
                for(var i = 0; i < data.images.length; i++){
                    var image = document.createElement("img"); image.src = projectsImages + data.images[i];
                    imageSlider.add(image)
                }
            }
            function adjust(){
                var dim = windowDim()
                var bigScreenclass = ["fixed","scrollable-v"]
                if(!viewProjectOpen || currentSection !== projectsBtn){
                    adjustDisplay(true)
                    return
                }
                adjustDisplay()
                function adjustDisplay(dontOpen){
                    if(dim.w >= screenThreshold){
                        if(viewProjectSmallScreen){viewProjectSmallScreen.close()}
                        if(!dontOpen){projectsUI.appendChild(viewProject)}
                        var mainHeight = getMainHeight()
                        tabWrapper.style.width = "60%"; 
                        viewProject.style.width = "35%"; viewProject.style.height = mainHeight.toString() + "px" 
                        viewProject.style.top = menu.getBoundingClientRect().bottom.toString() + "px"
                        viewProject.style.right = "3%"
                        changeClass(viewProject,"",bigScreenclass)
                    }
                    else{
                        if(!viewProjectSmallScreen){
                            viewProjectSmallScreen = new miniTab(undefined,undefined,function(){viewProjectOpen = false})
                        }
                        tabWrapper.style.width = ""
                        viewProject.style.width =""
                        viewProject.style.height = ""
                        viewProject.style.top = ""
                        viewProject.style.right = ""
                        changeClass(viewProject,bigScreenclass,"")
                        if(!dontOpen){
                            viewProjectSmallScreen.tab.appendChild(viewProject)
                            viewProjectSmallScreen.open()
                        }
                    }
                    if(dontOpen){remove(viewProject); if(viewProjectSmallScreen){viewProjectSmallScreen.close()}}
                    viewProjectOpen = true
                }
            }
        }
        function indicateSelectedView(viewNode){
            if(selectedView){changeClass(selectedView,"selected","")}
            changeClass(viewNode,"","selected")
            selectedView = viewNode
        }
    }
    function indexInterface(e){
        stopDefault(e)
        indicateSection(indexBtn)
        deleteSections()
        remove(currentSectionWindow)
        main.appendChild(indexUI)
        adjust()
        currentSectionWindow = indexUI
    }
    function setSection(sectionFunction){
        try{localStorage.setItem(sectionKey,sectionFunction)}
        catch(err){console.log("access denied to browser local storage")}
    }
    function deleteSections(){
        try{localStorage.removeItem(sectionKey)}
        catch(err){console.log("Access denied to browser's local storage")}
    }
    function getSection(){
        try{
            var section = localStorage.getItem(sectionKey)
            return sectionFunctions[section]
        }
        catch(err){console.log("Access denied to browser local storage"); return null}
    }
    if(timeSinceLogo >= logotime){startups()}
    else{setTimeout(startups,logotime - timeSinceLogo)}
    addEvent(indexBtn,"click",indexInterface)
    projectsBtn.onclick = projectInterface
}