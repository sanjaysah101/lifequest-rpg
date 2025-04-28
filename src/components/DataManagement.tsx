import { useState } from "react";

import { DownloadIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

export default function DataManagement() {
  const { user, habits, rewards, gameState, updateUser, updateHabits, updateRewards, updateGameState } =
    useAppContext();
  const [importError, setImportError] = useState("");

  const handleExport = () => {
    const exportData = {
      user,
      habits,
      rewards,
      gameState,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `lifequest_backup_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        // Validate data structure
        if (!importedData.user || !importedData.habits || !importedData.rewards || !importedData.gameState) {
          throw new Error("Invalid backup file format");
        }

        // Import data
        updateUser(importedData.user);
        updateHabits(importedData.habits);
        updateRewards(importedData.rewards);
        updateGameState(importedData.gameState);

        // Reset file input
        event.target.value = "";
      } catch (error) {
        setImportError("Failed to import data. Please check the file format.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
      <h2 className="mb-4 text-xl font-bold">Data Management</h2>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={handleExport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <DownloadIcon className="h-4 w-4" />
          Export Data Backup
        </Button>

        <div className="relative">
          <Button
            onClick={() => document.getElementById("import-file")?.click()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <UploadIcon className="h-4 w-4" />
            Import Data Backup
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      </div>

      {importError && <p className="mt-2 text-sm text-red-400">{importError}</p>}

      <p className="mt-4 text-sm text-blue-200">
        Export your data to create a backup or transfer to another device. Import previously exported data to restore.
      </p>
    </div>
  );
}
