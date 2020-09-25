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
}

function convertToDxf() {
  if (!pfcIsWindows())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
  var wpwl = pfcGetScript();
  document.pwl = wpwl;

  var drawings = document.getElementById("drawings").value.split(/\b\s+/);
  var expInstructions = pfcCreate("pfcDXFExportInstructions").Create();
  var session = pfcGetProESession();

  var index;
  for (index = 0; index < drawings.length; index++) {
    model = wpwl.pwlMdlOpen(drawings[index], "", false);
    var drawing = session.GetModel(
      drawings[index],
      pfcCreate("pfcModelType").MDL_DRAWING
    );
    var numberOfSheets = drawing.NumberOfSheets;
    if (numberOfSheets > 1) {
      var n;
      for (n = 1; n <= numberOfSheets; n++) {
        drawing.CurrentSheetNumber = n;

        var outputName = drawings[index].substring(
          0,
          drawings[index].length - 4
        );
        drawing.Export(outputName + "_" + n + ".dxf", expInstructions);
      }
    } else {
      var outputName = drawings[index].substring(0, drawings[index].length - 3);
      drawing.Export(outputName + "dxf", expInstructions);
    }
    drawing.Erase();
    wpwl.pwlMdlErase(drawings[index]);
  }

  alert("koniec");
}

function convertToPdf() {
  if (!pfcIsWindows())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
  var wpwl = pfcGetScript();
  document.pwl = wpwl;

  var drawings = document.getElementById("drawings").value.split(/\b\s+/);
  var expInstructions = pfcCreate("pfcPDFExportInstructions").Create();
  var pdfOptions = pfcCreate("pfcPDFOptions");
  var pdfLauncher = pfcCreate("pfcPDFOption").Create();
  pdfLauncher.OptionType = pfcCreate("pfcPDFOptionType").PDFOPT_LAUNCH_VIEWER;
  var launcherSet = false;
  var pdfArg = pfcCreate("MpfcArgument").CreateBoolArgValue(launcherSet);
  pdfLauncher.OptionValue = pdfArg;
  pdfOptions.Append(pdfLauncher);
  expInstructions.Options = pdfOptions;

  var index;
  for (index = 0; index < drawings.length; ++index) {
    wpwl.pwlMdlOpen(drawings[index], "", true);
    var session = pfcGetProESession();
    var drawing = session.GetModel(
      drawings[index],
      pfcCreate("pfcModelType").MDL_DRAWING
    );
    var outputName = drawings[index].substring(0, drawings[index].length - 3);
    drawing.Export(outputName + "pdf", expInstructions);
    drawing.Erase();
    wpwl.pwlMdlErase(drawings[index]);
  }

  alert("koniec");
}
