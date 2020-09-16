function getAllDrws() {
  if (!pfcIsWindows())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

  document.getElementById("drawings").value = "";
  var wpwl = pfcGetScript();
  document.pwl = wpwl;
  var session = pfcGetProESession();

  var activeServer = session.GetActiveServer();
  var alias = activeServer.Alias;
  var workspace = activeServer.ActiveWorkspace;
  // var workspace = activeServer.Server.GetActiveWorkspace
  var workspacePath = "wtws://" + alias + "/" + workspace;

  var drwsWithPathList = session.ListFiles(
    "*.drw",
    pfcCreate("pfcFileListOpt").FILE_LIST_LATEST,
    workspacePath
  );
  var drwsList = null;
  var index;
  for (index = 0; index < drwsWithPathList.length; ++index) {
    drwsList =
      drwsList +
      drwsWithPathList[index].substring(
        drwsWithPathList[index].lastIndexOf("/" + 1)
      );
    drwsList = drwsList + "\n";
  }

  document.getElementById("drawings").value = drwsList;
  document.getElementById("filescount").innerHTML = "" + (index + 1) + " rysunków";
  document.getElementById("workingdir").innerHTML = session.GetCurrentDirectory();
}

function convertToDxf() {
  if (!pfcIsWindows())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
  var wpwl = pfcGetScript();
  document.pwl = wpwl;
  
  document.getElementById("workingdir").innerHTML = session.GetCurrentDirectory();
  
  var drawings = document.getElementById("drawings").value.split(/\b\s+/);
  var index;
  for (index = 0; index < drawings.length; ++index) {
    model = document.pwl.pwlMdlOpen(drawings[index], "", true);
    var session = pfcGetProESession();
    var drawing = session.GetModel(
      drawings[index],
      pfcCreate("pfcModelType").MDL_DRAWING
    );
    var expInstructions = pfcCreate("pfcDXFExportInstructions").Create();
    var outputName = drawings[index].substring(0, drawings[index].length - 3);
    drawing.Export(outputName + "dxf", expInstructions);
    document.pwl.pwlMdlErase(drawings[index]);
  }
}
