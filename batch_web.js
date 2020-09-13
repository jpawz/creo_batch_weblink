function Convert() {
  if (!pfcIsWindows())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

  var form_elem = document.getElementById("mesg");
  var wpwl = pfcGetScript();
  document.pwl = wpwl;

  model = document.pwl.pwlMdlOpen("drw0001.drw", "", true);
  var session = pfcGetProESession();
  var drawing = session.GetModel(
    "drw0001.drw",
    pfcCreate("pfcModelType").MDL_DRAWING
  );

  var expInstructions = pfcCreate("pfcDXFExportInstructions").Create();
  try {
    drawing.Export("drw0001.dxf", expInstructions);
  } catch (e) {
    form_elem.innerHTML = e.toString();
  }
  document.pwl.pwlMdlErase("drw0001.drw");

  model = document.pwl.pwlMdlOpen("drw0002.drw", "", true);
  var drawing = session.GetModel(
    "drw0002.drw",
    pfcCreate("pfcModelType").MDL_DRAWING
  );
  try {
    drawing.Export("drw0002.dxf", expInstructions);
  } catch (e) {
    form_elem.innerHTML = e.toString();
  }

  document.pwl.pwlMdlErase("drw0002.drw");
}

function convertToDxf() {
  if (!pfcIsWindows())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
  var wpwl = pfcGetScript();
  document.pwl = wpwl;
  var form_elem = document.getElementById("mesg");

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

function getDrws() {}
