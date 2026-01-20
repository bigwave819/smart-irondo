import { View, Text, TouchableOpacity, Image } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import React, { useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

type EvidenceViewProps = {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  evidence?: any;
};

const EvidenceView = ({ bottomSheetRef, evidence }: EvidenceViewProps) => {
  const snapPoints = useMemo(() => ['90%'], []);

  // BACKDROP
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#f8fafc' }}
      handleIndicatorStyle={{ backgroundColor: '#cbd5e1' }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>

        {/* HEADER */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold text-slate-900">
              Evidence Details
            </Text>

            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.close()}
              className="h-10 w-10 rounded-full bg-slate-200 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#475569" />
            </TouchableOpacity>
          </View>

          <View className="h-1 w-16 bg-blue-600 rounded-full" />
        </View>

        {evidence ? (
          <View>

            {/* IMAGE */}
            <View className="items-center mb-6">
              <Image
                source={{ uri: evidence.url }}
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: 16
                }}
                resizeMode="cover"
              />
            </View>

            {/* INFO */}
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <InfoRow
                label="Type"
                value={evidence.type || 'N/A'}
                icon="folder"
              />
              <InfoRow
                label="Uploaded By"
                value={evidence.userName || 'Unknown'}
                icon="person"
              />
              <InfoRow
                label="Report ID"
                value={evidence.reportId || 'N/A'}
                icon="document"
              />
              <InfoRow
                label="URL"
                value={evidence.url || 'N/A'}
                icon="link"
                isLast
              />
            </View>

            {/* ACTION */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-4 rounded-xl flex-row items-center justify-center"
                activeOpacity={0.8}
              >
                <Ionicons name="download" size={20} color="white" />
                <Text className="text-white font-bold ml-2">
                  Download
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="items-center py-10">
            <Ionicons name="file-tray" size={48} color="#cbd5e1" />
            <Text className="text-slate-400 mt-3">
              No evidence selected
            </Text>
          </View>
        )}

      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default EvidenceView;

/* INFO ROW COMPONENT */
const InfoRow = ({
  label,
  value,
  icon,
  isLast = false
}: {
  label: string;
  value: string;
  icon: any;
  isLast?: boolean;
}) => (
  <View
    className={`flex-row items-center py-3 ${
      !isLast ? 'border-b border-slate-100' : ''
    }`}
  >
    <View className="bg-slate-50 p-2 rounded-lg mr-3">
      <Ionicons name={icon} size={18} color="#64748b" />
    </View>

    <View className="flex-1">
      <Text className="text-slate-500 text-xs uppercase tracking-wide mb-1">
        {label}
      </Text>
      <Text
        className="text-slate-900 font-semibold"
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  </View>
);
